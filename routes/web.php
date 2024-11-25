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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'animals' => Animal::take(4)->get(),
    ]);
});


Route::get('/animals', [AnimalController::class, 'index'])->name('animals.list');
Route::get('/animals/{id}', [AnimalController::class, 'show'])->name('animals.detail')->where('id', '[0-9]+');

Route::post('/apply', [UserController::class,'applyForApproval'])->middleware('auth'); //user žádá o potvrzení

Route::middleware(['auth', 'role:Admin'])->group( function (){
    Route::get('/users', [UserController::class, 'show_users'])->name('admin');
    Route::get('/users/{id}', [UserController::class,'show_detail'])->where('id', '[0-9]+');
    Route::get('/users/{id}/edit',[UserController::class,'show_edit'])->where('id', '[0-9]+');
    Route::get('/users/create', [UserController::class,'show_create']);
    Route::post('/users/create', [UserController::class, 'create_user']);
    Route::post('/users/{id}/delete', [UserController::class, 'remove_user'])->where('id', '[0-9]+');
    Route::post('/users/{id}/edit', [UserController::class, 'edit_user'])->where('id', '[0-9]+');
});

Route::middleware(['auth', 'role:Volunteer|Admin'])->group( function (){
    Route::get('/volunteer/history', [WalkBookingController::class, 'getVolunteerHistory']); //jeho historie

    Route::get('/animals/{id}/schedule-volunteer',[WalkBookingController::class, 'showAnimalSchedule'])->where('id', '[0-9]+');
    Route::post('/animals/{id}/bookTermin', [WalkBookingController::class, 'bookTermin'])->where('id', '[0-9]+');
    Route::post('/animals/{id}/cancelTermin', [WalkBookingController::class, 'cancelTermin'])->where('id', '[0-9]+');
});

Route::middleware(['auth', 'role:Vet|Admin'])->group( function (){
    
    //kouka do požadavku
    Route::get('/request', [ExaminationRequestController::class, 'index']); //seznam requestu na pro lečení zvířat
    Route::get('/request/{id}', [ExaminationRequestController::class, 'RequestDetail'])->where('id', '[0-9]+');
    Route::get('/request/{id}/edit', [ExaminationRequestController::class,'geteditRequest'])->where('id', '[0-9]+');

    Route::post('/request/{id}/edit', [ExaminationRequestController::class,'editRequest'])->where('id', '[0-9]+');

    //plánuje termíny prohlídek
    Route::get('/examination', [ExaminationController::class,'IndexExamination'])->name('examination.index');
    Route::get('/examination/{id}', [ExaminationController::class,'DetailExamination'])->where('id', '[0-9]+');
    Route::get('/examination/{id}/edit', [ExaminationController::class,'EditDetailExamination'])->where('id', '[0-9]+');
    Route::get('/examination/create', [ExaminationController::class,'CreateFormExamination']);

    Route::post('/examination/create', [ExaminationController::class,'createExamination']);
    Route::post('/examination/{id}/delete', [ExaminationController::class,'deleteExamination'])->where('id', '[0-9]+');
    Route::post('/examination/{id}/edit', [ExaminationController::class,'editExamination'])->where('id', '[0-9]+');

    //udržuje zdravotní záznamy zvířat
    Route::get('/animals/{id}/record', [ExaminationRecordController::class, 'IndexAnimalRecords'])->where('id', '[0-9]+')->name('animals.record');
    Route::get('/record/{id}', [ExaminationRecordController::class, 'DetailAnimalRecord'])->where('id', '[0-9]+');
    Route::get('/record/{id}/edit', [ExaminationRecordController::class, 'getEditDetailAnimalRecord'])->where('id', '[0-9]+');
    Route::get('/animals/{id}/record/create', [ExaminationRecordController::class, 'getCreateAnimalRecord'])->where('id', '[0-9]+');
    
    Route::post('/animals/{id}/record/create', [ExaminationRecordController::class, 'createAnimalRecord'])->where('id', '[0-9]+');
    Route::post('/record/{id}/edit', [ExaminationRecordController::class, 'editDetailAnimalRecord'])->where('id', '[0-9]+');
    Route::post('/record/{id}/delete', [ExaminationRecordController::class, 'deleteDetailAnimalRecord'])->where('id', '[0-9]+');
});

Route::middleware(['auth', 'role:CareTaker|Admin'])->group( function (){


    //spravuje zvířata, vede jejich evidenci
    Route::get('/animals/{id}/edit', [AnimalController::class,'edit'])->where('id', '[0-9]+');
    Route::get('/animals/create', [AnimalController::class,'create']);

    Route::post('/animals/create', [AnimalController::class,'store']);
    Route::post('/animals/{id}/edit', [AnimalController::class,'update'])->where('id', '[0-9]+');
    Route::post('/animals/{id}/delete', [AnimalController::class, 'destroy'])->where('id', '[0-9]+');

    //vytváří rozvrhy pro venčení
    Route::get('/animals/{id}/planWalks',[WalkBookingController::class, 'getAnimalPlan'])->where('id', '[0-9]+');
    Route::post('/animals/{id}/planWalks',[WalkBookingController::class, 'postAnimalPlan'])->where('id', '[0-9]+');

    //ověřuje dobrovolníky
    Route::get('/approvevolunteers', [UserController::class,'getApproveVolunteers']);
    Route::get('/approvevolunteers/{id}', [UserController::class,'getApproveVolunteersDetail'])->where('id', '[0-9]+');
    Route::post('/approvevolunteers/{id}/approve', [UserController::class,'ApproveVolunteer'])->where('id', '[0-9]+');
    Route::post('/approvevolunteers/{id}/deny', [UserController::class,'DenyVolunteer'])->where('id', '[0-9]+');

    //schvaluje rezervace zvířat na venčení
    Route::get('/booking',[WalkBookingController::class,'Index']); //all boookings
    Route::get('animals/{id}/booking',[WalkBookingController::class,'AnimalIndex'])->where('id', '[0-9]+');
    Route::get('/booking/{id}', [WalkBookingController::class,'Detail'])->where('id', '[0-9]+');
    Route::post('/booking/{id}/approve',[WalkBookingController::class,'ApproveBooking'])->where('id', '[0-9]+');
    Route::post('/booking/{id}/decline',[WalkBookingController::class,'DeclineBooking'])->where('id', '[0-9]+'); 


    //eviduje zapůjčení a vrácení
    Route::post('animals/{id}/taken',[AnimalController::class,'animalTaken'])->where('id', '[0-9]+');
    Route::post('animals/{id}/returned',[AnimalController::class,'animalReturned'])->where('id', '[0-9]+');

    //vytváří požadavky na veterináře
    Route::get('animals/{id}/createrequest',[ExaminationRequestController::class,'create'])->where('id', '[0-9]+');
    Route::post('animals/createrequest',[ExaminationRequestController::class,'store']);
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
