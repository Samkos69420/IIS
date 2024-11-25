<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\CaretakerController;
use App\Http\Controllers\VetController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\ExaminationRequestController;
use App\Http\Controllers\WalkBookingController;
use App\Http\Controllers\WalkPlanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExaminationRecordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Animal;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//href={route('examination.createForm')}

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'animals' => Animal::take(4)->get(),
    ]);
})->name('home');

Route::get('/animals', [AnimalController::class, 'index'])->name('animals.list');
Route::get('/animals/{id}', [AnimalController::class, 'show'])->name('animals.detail')->where('id', '[0-9]+');

Route::post('/apply', [UserController::class, 'applyForApproval'])->middleware('auth')->name('users.applyApproval');

Route::middleware(['auth', 'role:Admin'])->group(function () {
    Route::get('/users', [UserController::class, 'show_users'])->name('users.list');
    Route::get('/users/{id}', [UserController::class, 'show_detail'])->where('id', '[0-9]+')->name('users.detail');
    Route::get('/users/{id}/edit', [UserController::class, 'show_edit'])->where('id', '[0-9]+')->name('users.edit');
    Route::get('/users/create', [UserController::class, 'show_create'])->name('users.createForm');
    Route::post('/users/create', [UserController::class, 'create_user'])->name('users.create');
    Route::post('/users/{id}/delete', [UserController::class, 'remove_user'])->where('id', '[0-9]+')->name('users.delete');
    Route::post('/users/{id}/edit', [UserController::class, 'edit_user'])->where('id', '[0-9]+')->name('users.update');
});

Route::middleware(['auth', 'role:Volunteer|Admin'])->group(function () {
    Route::get('/volunteer/history', [WalkBookingController::class, 'getVolunteerHistory'])->name('volunteer.history');
    Route::get('/animals/{id}/schedule-volunteer', [WalkBookingController::class, 'showAnimalSchedule'])->where('id', '[0-9]+')->name('animals.scheduleVolunteer');
    Route::post('/booking/{id}/bookTermin', [WalkBookingController::class, 'bookTermin'])->where('id', '[0-9]+')->name('booking.bookTermin');
    Route::post('/booking/{id}/cancelTermin', [WalkBookingController::class, 'cancelTermin'])->where('id', '[0-9]+')->name('booking.cancelTermin');
});

Route::middleware(['auth', 'role:Vet|Admin'])->group(function () {
    Route::get('/request', [ExaminationRequestController::class, 'index'])->name('requests.index');
    Route::get('/request/{id}', [ExaminationRequestController::class, 'RequestDetail'])->where('id', '[0-9]+')->name('requests.detail');
    Route::get('/request/{id}/edit', [ExaminationRequestController::class, 'geteditRequest'])->where('id', '[0-9]+')->name('requests.editForm');
    Route::post('/request/{id}/edit', [ExaminationRequestController::class, 'editRequest'])->where('id', '[0-9]+')->name('requests.update');

    Route::get('/examination', [ExaminationController::class, 'IndexExamination'])->name('examination.index');
    Route::get('/examination/{id}', [ExaminationController::class, 'DetailExamination'])->where('id', '[0-9]+')->name('examination.detail');
    Route::get('/examination/{id}/edit', [ExaminationController::class, 'EditDetailExamination'])->where('id', '[0-9]+')->name('examination.editForm');
    Route::get('/examination/create', [ExaminationController::class, 'CreateFormExamination'])->name('examination.createForm');
    Route::post('/examination/create', [ExaminationController::class, 'createExamination'])->name('examination.create');
    Route::post('/examination/{id}/delete', [ExaminationController::class, 'deleteExamination'])->where('id', '[0-9]+')->name('examination.delete');
    Route::post('/examination/{id}/edit', [ExaminationController::class, 'editExamination'])->where('id', '[0-9]+')->name('examination.update');

    Route::get('/animals/{id}/record', [ExaminationRecordController::class, 'IndexAnimalRecords'])->where('id', '[0-9]+')->name('animals.record');
    Route::get('/record/{id}', [ExaminationRecordController::class, 'DetailAnimalRecord'])->where('id', '[0-9]+')->name('records.detail');
    Route::get('/record/{id}/edit', [ExaminationRecordController::class, 'getEditDetailAnimalRecord'])->where('id', '[0-9]+')->name('records.editForm');
    Route::get('/animals/{id}/record/create', [ExaminationRecordController::class, 'getCreateAnimalRecord'])->where('id', '[0-9]+')->name('records.createForm');
    Route::post('/animals/{id}/record/create', [ExaminationRecordController::class, 'createAnimalRecord'])->where('id', '[0-9]+')->name('records.create');
    Route::post('/record/{id}/edit', [ExaminationRecordController::class, 'editDetailAnimalRecord'])->where('id', '[0-9]+')->name('records.update');
    Route::post('/record/{id}/delete', [ExaminationRecordController::class, 'deleteDetailAnimalRecord'])->where('id', '[0-9]+')->name('records.delete');
});

Route::middleware(['auth', 'role:CareTaker|Admin'])->group(function () {
    Route::get('/animals/{id}/edit', [AnimalController::class, 'edit'])->where('id', '[0-9]+')->name('animals.edit');
    Route::get('/animals/create', [AnimalController::class, 'create'])->name('animals.createForm');
    Route::post('/animals/create', [AnimalController::class, 'store'])->name('animals.create');
    Route::post('/animals/{id}/edit', [AnimalController::class, 'update'])->where('id', '[0-9]+')->name('animals.update');
    Route::post('/animals/{id}/delete', [AnimalController::class, 'destroy'])->where('id', '[0-9]+')->name('animals.delete');

    Route::get('/animals/{id}/planWalks', [WalkBookingController::class, 'getAnimalPlan'])->where('id', '[0-9]+')->name('walks.planForm');
    Route::post('/animals/{id}/planWalks', [WalkBookingController::class, 'postAnimalPlan'])->where('id', '[0-9]+')->name('walks.plan');

    Route::get('/approvevolunteers', [UserController::class, 'getApproveVolunteers'])->name('volunteers.approveList');
    Route::get('/approvevolunteers/{id}', [UserController::class, 'getApproveVolunteersDetail'])->where('id', '[0-9]+')->name('volunteers.approveDetail');
    Route::post('/approvevolunteers/{id}/approve', [UserController::class, 'ApproveVolunteer'])->where('id', '[0-9]+')->name('volunteers.approve');
    Route::post('/approvevolunteers/{id}/deny', [UserController::class, 'DenyVolunteer'])->where('id', '[0-9]+')->name('volunteers.deny');

    Route::get('/booking', [WalkBookingController::class, 'Index'])->name('bookings.list');
    Route::get('animals/{id}/booking', [WalkBookingController::class, 'AnimalIndex'])->where('id', '[0-9]+')->name('animals.bookings');
    Route::get('/booking/{id}', [WalkBookingController::class, 'Detail'])->where('id', '[0-9]+')->name('booking.detail');
    Route::post('/booking/{id}/approve', [WalkBookingController::class, 'ApproveBooking'])->where('id', '[0-9]+')->name('booking.approve');
    Route::post('/booking/{id}/decline', [WalkBookingController::class, 'DeclineBooking'])->where('id', '[0-9]+')->name('booking.decline');
    Route::post('booking/{id}/delete', [WalkBookingController::class, 'deleteBooking'])->where('id', '[0-9]+')->name('booking.delete');

    Route::post('animals/{id}/taken', [AnimalController::class, 'animalTaken'])->where('id', '[0-9]+')->name('animals.taken');
    Route::post('animals/{id}/returned', [AnimalController::class, 'animalReturned'])->where('id', '[0-9]+')->name('animals.returned');

    Route::get('animals/{id}/createrequest', [ExaminationRequestController::class, 'create'])->where('id', '[0-9]+')->name('requests.createForm');
    Route::post('animals/createrequest', [ExaminationRequestController::class, 'store'])->name('requests.create');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
