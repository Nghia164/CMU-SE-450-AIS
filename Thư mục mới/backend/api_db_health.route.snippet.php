<?php
// Add these lines to routes/api.php

use App\Http\Controllers\DatabaseHealthController;
use Illuminate\Support\Facades\Route;

Route::get('/health/database', DatabaseHealthController::class);
