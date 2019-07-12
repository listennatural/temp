import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
