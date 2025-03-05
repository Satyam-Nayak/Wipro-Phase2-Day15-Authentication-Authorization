import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <div class="todo-container">
      <h2>Todo List</h2>
      
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>New Todo</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>
        
        <button mat-raised-button color="primary" type="submit" [disabled]="!todoForm.valid">
          Add Todo
        </button>
      </form>

      <mat-list>
        <mat-list-item *ngFor="let todo of todos">
          <span [class.completed]="todo.completed">{{ todo.title }}</span>
          <button mat-icon-button (click)="toggleTodo(todo)">
            <mat-icon>{{ todo.completed ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="deleteTodo(todo.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
    }
    form {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .completed {
      text-decoration: line-through;
      color: #888;
    }
    mat-form-field {
      flex: 1;
    }
  `]
})
export class TodoComponent implements OnInit {
  todos: any[] = [];
  todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const todo = {
        title: this.todoForm.value.title,
        completed: false
      };
      
      this.todoService.addTodo(todo).subscribe({
        next: () => {
          this.loadTodos();
          this.todoForm.reset();
        },
        error: (error) => console.error('Failed to add todo:', error)
      });
    }
  }

  toggleTodo(todo: any) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: () => this.loadTodos(),
      error: (error) => console.error('Failed to update todo:', error)
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.loadTodos(),
      error: (error) => console.error('Failed to delete todo:', error)
    });
  }
}