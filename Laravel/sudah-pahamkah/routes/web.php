<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\UsersController;

Route::get('/tasks', [TasksController::class, 'index']);
Route::get('tasks/create', [TasksController::class, 'create']);
Route::post('/tasks', [TasksController::class, 'store']);
Route::get('/tasks/{tasks}', [TasksController::class, 'show']);
Route::get('/tasks/{tasks}/edit', [TasksController::class, 'edit']);
Route::put('/tasks/{tasks}', [TasksController::class, 'update']);
Route::delete('/tasks/{tasks}', [TasksController::class, 'destroy']);