import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, Inject, LOCALE_ID } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange, STReq, STRequestOptions, STRes, STPage } from '@delon/abc';
import { HttpHeaders } from '@angular/common/http';
import { tmpdir } from 'os';
import { formatDate } from '@angular/common';

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
  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
  ) { }
  // 请求链接
  url = 'user/list';
  // 是否展示加载中
  loading = false;
  // 延迟加载时间
  loadingDelay = 500;
  // 搜索菜单是否展开
  expandForm = true;
  // 当前页
  pi = 1;
  // 每页数量
  ps = 10;
  // 用于动态获取 status 的keys
  objKeys = Object.keys;
  // 存放已选中数据
  selectedRows = [];
  // 是否展示抽屉
  drawerVisible = false;
  // 抽屉数据
  drawerData = {};
  // 抽屉是否为加载态
  drawerLoading = false;

  // 请求携带参数
  params = {
    // 后台要求参数,按照某个字段排序
    orderByColumn: "createtime",
    // 后台要求参数,排序方式 desc asc
    isAsc: "desc",
    condition: '{}',
    sorter: '',
    statusList: [],
  };

  // 额外参数
  condition: any = {
    nickname: "",
    phone: "",
    role: 0,
    status: 0,
    register: 0,
    minFans: 0,
    maxFans: 0,
    timeRange: [],
    beginTime: "",
    endTime: "",
  }

  // 分页配置
  pages: STPage = {
    total: "符合条件的数据共{{total}}条",
    // 是否前端分页,如果后端分页,则要求返回值中拥有 list,total 其中list为展示的数据,total为总数据
    front: false,
    // 显示分页
    show: true,
    showSize: true,
    // 页面以0开始
    // zeroIndexed: true,
  };

  // 请求配置
  reqParams: STReq = {
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
      // 重新设置参数
      const p: any = requestOptions.params;

      // 设置开始结束时间
      if (this.condition.timeRange.length > 0) {
        this.condition.beginTime = formatDate(this.condition.timeRange[0], "yyyy-MM-dd", this.locale);
        this.condition.endTime = formatDate(this.condition.timeRange[1], "yyyy-MM-dd", this.locale);
      }

      p.condition = JSON.stringify(this.condition).replace(/null/g, '""');

      requestOptions.params = p;
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

      // 设定数据
      data = data.map((i: any) => {
        return this.showData(i);
      })

      this.cdr.detectChanges();
      return data;
    }
  };

  // 状态值配置
  status = {
    "1": { text: "正常", type: "#108ee9", checked: false },
    "-1": { text: "注销", type: "#f50", checked: false },
    "-2": { text: "冻结", type: "purple", checked: false },
    "-3": { text: "删除", type: "red", checked: false },
  };

  // 注册值配置
  register = {
    "-1": { text: "内部添加", type: "#108ee9", checked: false },
    "1": { text: "手机号码", type: "#2db7f5", checked: false },
    "2": { text: "微信", type: "gold", checked: false },
    "3": { text: "QQ", type: "geekblue", checked: false },
    "4": { text: "新浪微博", type: "cyan", checked: false },
    "5": { text: "支付宝", type: "magenta", checked: false },
  };

  // 角色值
  role = {
    "1": { text: "教师", type: "#2db7f5", checked: false },
    "2": { text: "学员", type: "#87d068", checked: false },
  };

  // 来源值
  source = {
    "1": { text: "官方APP", type: "#2db7f5", checked: false },
  };

  // 列配置
  columns: STColumn[] = [
    { title: '', index: 'id', type: 'checkbox' },
    { title: '头像', index: 'avatar', render: "avatar" },
    { title: '昵称', width: '30px', index: 'nickname' },
    { title: '联系方式', index: 'phone' },
    { title: '粉丝', index: 'fans' },
    { title: '知言币', index: 'coins' },
    { title: '积分', index: 'integral' },
    { title: '状态', index: 'status', render: 'status', },
    { title: '注册方式', index: 'register', render: 'register' },
    { title: '角色', index: 'role', render: 'role' },
    { title: '来源', index: 'source', render: "source" },
    { title: '注册时间', type: 'date', index: 'createtime' },
  ];

  // 用来调用组件api
  @ViewChild('st', { static: false })
  st: STComponent;

  // 页面初始化
  ngOnInit() {
  }

  // 配置单条数据,需要显示的各个值
  showData(data: any) {
    // 配置状态值
    const statusItem = this.status[data.status];
    data.statusText = statusItem.text;
    data.statusType = statusItem.type;

    // 配置注册值
    const registerItem = this.register[data.register];
    data.registerText = registerItem.text;
    data.registerType = registerItem.type;

    // 配置角色值
    const roleItem = this.role[data.role];
    data.roleText = roleItem.text;
    data.roleType = roleItem.type;

    // 配置来源值
    const sourceItem = this.source[data.source];
    data.sourceText = sourceItem.text;
    data.sourceType = sourceItem.type;
    return data;
  }

  // 重置
  reset() {
    this.pi = 1;
    this.ps = 10;
    // this.st.clear();
    this.st.load(this.pi, this.params);
  }

  // 搜索
  search() {
    setTimeout(() => {
      console.log("搜索");
      console.log(this.condition);
      this.st.reload()
    });
  }

  // 表格变化时触发
  change(e: STChange) {
    switch (e.type) {
      // 执行选中操作
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        break;
      // 执行单击操作
      case 'click':
        this.drawerOpen(e.click.item);
        break;
      default:
        break
    }
  }

  // 新增
  add() {
  }

  // 打开右侧抽屉drawer
  drawerOpen(data: any): void {
    console.log(data);
    this.drawerLoading = true;

    this.drawerVisible = true;
  }

  // 关闭抽屉
  drawerClose(): void {
    this.drawerVisible = false;
  }

  // 提交抽屉中数据
  drawerSubmit(): void {
    // 如果数据正在加载
    if (this.drawerLoading) {
      this.msg.error(`数据正在加载,请稍后...`);
    }

    console.log('submit');

  }
}
