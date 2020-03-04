import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {


  task_formated = this.formatedTask();

  constructor() { }

  ngOnInit(): void {
  }

  regex = /em\s[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  
  format(input: string): string{
    if(this.regex.test(input)) {
      let filter = this.regex.exec(input)["input"];
      return filter;
    }
    return "False";
  }

  convert(input: string) {
    let converted = {'date':'', 'title':''};
    converted['title'] = input.slice(0, this.regex.exec(input).index);
    converted['date'] = input.slice(this.regex.exec(input).index+3, input.length-5);
    converted['status'] = false;
    return converted;
  }

  addTask(task: string) {
    let formated = this.format(task);
    if(formated != "False") {
      //convert json to string
      let task = JSON.stringify(this.convert(formated));
      this.store(task);
      this.task_formated.push(this.showTask(task));
      console.log("Task Adicionada.")
    }
     
  }

  //salva no localStorage sobre key random.
  store(task: string) {
    let random_key = String(Math.floor(Math.random()*1204));
    window.localStorage.setItem(random_key, task);
  }

  //pega as chaves armazenadas no localStorage.
  getKeys(): Array<String> {
    let keys = [];
    let entries = Object.entries(localStorage);
    for (let key in entries) {
      keys.push(entries[key][0]);
    }
    return keys;
  }

  //remove from localStorage if maches title
  remove(title:string): void {
    title = title.split("| ")[1];
    let keys = this.getKeys();
    for(let x=0; x<keys.length; x++) {
      let ctask = JSON.parse(window.localStorage.getItem(String(keys[x])));
      if(ctask['title']==title) {
        window.localStorage.removeItem(String(keys[x]));
      }
    }
  }

  //pega as tasks do localStorage.
  tasks(): Array<String> {
    let tasks = [];
    let keys = this.getKeys();
    for(let key=0;key<keys.length;key++) {
      tasks.push(window.localStorage.getItem(String(keys[key])));
    }
    return tasks;
  }

  //deixa tudo mais clean.
  formatedTask(): Array<String> {
    let tasks = [];
    const current_tasks = this.tasks();
    for(let x=0; x<current_tasks.length;x++) {
      let converted = JSON.parse(String(current_tasks[x]));
      tasks.push(`${converted['date']} | ${converted['title']}`);
    }
    return tasks;
  }

  showTask(task: string): string {
    let converted = JSON.parse(task);
    return `${converted['date']} | ${converted['title']}`;
  }

}
