import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange, STReq, STRequestOptions, STRes, STPage } from '@delon/abc';
import { HttpHeaders } from '@angular/common/http';

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
  // 请求链接
  url = 'user/list';
  // 是否展示加载中
  loading = false;
  // 延迟加载时间
  loadingDelay = 500;
  // 搜索菜单是否展开
  expandForm = false;
  // 当前页
  pi = 0;
  // 每页数量
  ps = 10;

  // 请求携带参数
  params = {
    // 后台要求参数,按照某个字段排序
    orderByColumn: "createtime",
    // 后台要求参数,排序方式 desc asc
    isAsc: "desc",
    sorter: '',
    status: null,
    statusList: [],
  };

  // 分页配置
  pages: STPage = {
    total: "符合条件的数据共{{total}}条",
    // 是否前端分页,如果后端分页,则要求返回值中拥有 list,total 其中list为展示的数据,total为总数据
    front: false,
    // 显示分页
    show: true,
    showSize: true,
    zeroIndexed: true,
  };

  // 请求配置
  reqParams: STReq = {
    // headers: (new HttpHeaders()).set("token", "WA_TOKENk071lhnxfM81HA0Diw8d78j2").set("Token", "WA_TOKENk071lhnxfM81HA0Diw8d78j2"),
    // 修改参数名,使其符合后台要求规范
    reName: {
      pi: "pageNum",
      ps: "pageSize",
    },
    method: "POST",
    params: this.params,
    // 请求前数据处理
    process: (requestOptions: STRequestOptions) => {
      // 加载中
      this.loading = true;
      return requestOptions;
    },
  };

  // 返回值配置
  resParams: STRes = {
    // 修改返回值部分key,使其符合st要求
    reName: {
      list: "rows",
    },
    // 请求返回数据处理
    process: (data: STData[], rawData?: any) => {
      // 取消加载
      this.loading = false;

      data = data.filter((val: any, i: number) => {
        if (i < 10) {
          return true;
        }
        return false;
      });

      // 设定数据
      data = data.map((i: any) => {
        const statusItem = this.status[i.status];
        i.statusText = statusItem.text;
        i.statusType = statusItem.type;
        return i;
      })

      this.cdr.detectChanges();
      return data;
    }
  };

  // 状态值配置
  status = [
    { index: 0, text: '关闭', value: false, type: 'default', checked: false },
    { index: 1, text: '运行中', value: false, type: 'processing', checked: false, },
    { index: 2, text: '已上线', value: false, type: 'success', checked: false },
    { index: 3, text: '关闭', value: false, type: 'warning', checked: false },
    { index: 4, text: '异常', value: false, type: 'error', checked: false },
    { index: 5, text: '未知', value: false, type: 'error', checked: false },
  ];
  // 列配置
  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '头像', type: 'img', index: 'avatar' },
    { title: '昵称', index: 'nickname' },
    { title: '联系方式', index: 'phone' },
    { title: '粉丝', index: 'fans' },
    { title: '知言币', index: 'coins' },
    { title: '积分', index: 'integral' },
    {
      title: '状态',
      index: 'status',
      render: 'status',
      filter: {
        menus: this.status,
        fn: (filter: any, record: any) => record.status === filter.index,
      },
    },
    { title: '注册方式', index: 'register' },
    { title: '角色', index: 'role' },
    { title: '来源', index: 'source' },
    { title: '注册时间', type: 'date', index: 'createtime' },
  ];

  // 用来调用组件api
  @ViewChild('st', { static: false })
  st: STComponent;
  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
  ) { }

  // 页面初始化
  ngOnInit() {
  }

  // 重置
  reset() {
    setTimeout(() => this.st.reload());
  }

  // 搜索
  search() {
    console.log("搜索");

  }

  // 表格变化时触发
  change(e: STChange) {
    console.log("change");
    console.log(e);

  }

  // 新增
  add() {
  }
}
