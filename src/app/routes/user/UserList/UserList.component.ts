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
  url = '/lt/user/list';
  params = {
    sorter: '',
    status: null,
    statusList: [],
  };

  req = {
    method: "POST",
    params: this.params,
  };

  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '头像', type: 'img', index: 'avatar' },
    { title: '昵称', index: 'nickname' },
    { title: '联系方式', index: 'phone' },
    { title: '粉丝', index: 'fans' },
    { title: '知言币', index: 'coins' },
    { title: '积分', index: 'integral' },
    { title: '注册方式', index: 'register' },
    { title: '角色', index: 'role' },
    { title: '来源', index: 'source' },
    { title: '注册时间', type: 'date', index: 'createtime' },
  ];

  constructor(
    //   private http: _HttpClient,
    public msg: NzMessageService,
    //   private modalSrv: NzModalService,
    //   private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // this.getData();
  }
}
