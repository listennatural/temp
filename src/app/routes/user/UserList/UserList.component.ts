import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';

/**
 * 新建的 component  必须在app.module.ts 中引入 然后 放入 @NgModule 中的 imports 数组中,
 * 在本项目中, 可以在 routes.module.ts 中引入 然后放入 COMPONENTS 数组中, 这个数组会在 app.module.ts 中引入
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './UserList.component.html',
  styleUrls: ['./UserList.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: 0, text: '未知', value: false, type: 'default', checked: false },
    { index: 1, text: '正常', value: false, type: 'processing', checked: false },
    { index: 2, text: '注销', value: false, type: 'warning', checked: false },
    { index: 3, text: '冻结', value: false, type: 'error', checked: false },
    { index: 4, text: '删除', value: false, type: 'default', checked: false },
    { index: 5, text: '未授权', value: false, type: 'default', checked: false },
  ];
  @ViewChild('st', { static: true })
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '头像', index: 'avatar' },
    { title: '昵称', index: 'nickname' },
    { title: '联系方式', index: 'phone' },
    { title: '粉丝', index: 'fans' },
    { title: '知言币', index: 'coins' },
    { title: '积分', index: 'integral' },
    // {
    //   title: '服务调用次数',
    //   index: 'callNo',
    //   type: 'number',
    //   format: (item: any) => `${item.callNo} 万`,
    //   sorter: (a: any, b: any) => a.callNo - b.callNo,
    // },
    {
      title: '状态',
      index: 'status',
      render: 'status',
      filter: {
        menus: this.status,
        fn: (filter: any, record: any) => record.status === filter.index,
      },
    },
    {
      title: '更新时间',
      index: 'updatetime',
      type: 'date',
      // sort: {
      //   compare: (a: any, b: any) => a.updatedAt - b.updatedAt,
      // },
    },
    {
      title: '操作',
      buttons: [
        {
          text: '配置',
          click: (item: any) => this.msg.success(`配置${item.id}`),
        },
        {
          text: '订阅警报',
          click: (item: any) => this.msg.success(`订阅警报${item.id}`),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }

    this.http
      .get('/lt/user/list', this.q)
      .pipe(
        map((list: any[]) =>
          list.map(i => {
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          }),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe(res => {
        this.data = res;
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove() {
    this.http.delete('/rule', { nos: this.selectedRows.map(i => i.no).join(',') }).subscribe(() => {
      this.getData();
      this.st.clearCheck();
    });
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: '新建规则',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
      },
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
