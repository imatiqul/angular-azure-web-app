import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { AppConfigService } from './appconfig.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,  OnDestroy {

  constructor(private appService: AppService) {}

  title = 'angular-azure-web-app';

  todoForm = new FormGroup({
    task: new FormControl('', Validators.nullValidator && Validators.required),
    assignee: new FormControl('', Validators.nullValidator && Validators.required),
    status: new FormControl('', Validators.nullValidator && Validators.required)
  });

  tasks: any[] = [];
  settings: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit() {
    console.log(this.todoForm.value);
    this.appService.addTask(this.todoForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
      this.todoForm.reset();
    });
  }

  deleteTask(taskid: number) {
    console.log('deleting this task:::', taskid);
    this.appService.deleteTask(taskid).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
    });
  }

  editTask(task: any) {
    console.log('editing this task:::', task);
    this.appService.editTask(task).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      this.getTasks();
    });
  }

  getTasks() {
    this.appService.getTasks().pipe(takeUntil(this.destroy$)).subscribe((tasks: any[]) => {
      this.tasks = tasks;
    });
  }

  getAppSettings() {
    // this.settings = this.appConfigService.settings;
    this.settings = {headerColor : '#ddd',  headerTitleColor: '#fdf'};
  }

  ngOnInit() {
    this.getTasks();
    this.getAppSettings();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
