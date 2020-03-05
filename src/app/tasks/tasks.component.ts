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
      this.store(formated)
      console.log("Task Adicionada.")
    }
     
  }

  //salva no localStorage sobre key random.
  store(task): void {
    let random_key = String(Math.floor(Math.random()*1204));
    task = this.convert(task);
    task.id = random_key;
    this.task_formated.push(task);
    task = JSON.stringify(task);
    window.localStorage.setItem(random_key, task);
  }

  //pega as chaves armazenadas no localStorage.
  getKeys(): Array<string> {
    let keys = [];
    let entries = Object.entries(localStorage);
    for (let key in entries) {
      keys.push(entries[key][0]);
    }
    return keys;
  }

  //remove from localStorage if maches title
  remove(id:string): void {
    let temp;
    for(let x=0; x<this.task_formated.length; x++) {
      temp = this.task_formated[x];
      if(temp.id == id) {
        this.task_formated.splice(x, 1);
        window.localStorage.removeItem(id);
        console.log(`task de id: ${temp.id} removida.`);
        break;
      }
    }
  }

  finish(id: string): void {
    let temp;
    let on_local = window.localStorage.getItem(id);
    for(let x=0; x<this.task_formated.length; x++) {
      temp = this.task_formated[x];
      if(temp.id == id) {
        this.task_formated[x].status = true;
        on_local = this.changeStatus(on_local);
      }
    }
  }

  changeStatus(task): string {
    task = JSON.parse(task);
    task.status = true;
    window.localStorage.setItem(task.id, JSON.stringify(task));
    return JSON.stringify(task);
  }

  //pega as tasks do localStorage.
  tasks(): Array<string> { 
    let tasks = [];
    let keys = this.getKeys();
    for(let key=0;key<keys.length;key++) {
      tasks.push(window.localStorage.getItem(String(keys[key])));
    }
    return tasks;
  }

  //deixa tudo mais clean.
  formatedTask() { 
    let tasks = [];
    const current_tasks = this.tasks();
    for(let x=0; x<current_tasks.length;x++) {
      let converted = JSON.parse(String(current_tasks[x]));
      tasks.push(converted);
    }
    return tasks;
  }


}
