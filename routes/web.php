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
Route::get('/animals/{id}', [AnimalController::class, 'show'])->name('animals.detail');



Route::middleware(['auth', 'role:Admin'])->group( function (){
    Route::get('/users', [UserController::class, 'show_users'])->name('adnim');
    Route::get('/users/{id}', [UserController::class,'show_detail'])->name('admin');
    Route::get('/users/{id}/edit',[UserController::class,'show_edit'])->name('admin');
    Route::get('/users/create', [UserController::class,'show_create'])->name('admin');
    Route::post('/users/create', [UserController::class, 'create_user'])->name('admin');
    Route::post('/users/{id}/delete', [UserController::class, 'remove_user'])->name('admin');
    Route::post('/users/{id}/edit', [UserController::class, 'edit_user'])->name('admin');
});

Route::middleware(['auth', 'role:Volunteer,Admin'])->group( function (){
    Route::get('/volunteer/history', [WalkBookingController::class, 'getVolunteerHistory']); //jeho historie

    Route::get('/animals/{id}/schedule-volunteer',[WalkBookingController::class, 'showAnimalSchedule']);
    Route::post('/animals/{id}/bookTermin', [WalkBookingController::class, 'bookTermin']);
    Route::post('/animals/{id}/cancelTermin', [WalkBookingController::class, 'cancelTermin']);
});

Route::middleware(['auth', 'role:Vet,Admin'])->group( function (){
    
    //kouka do požadavku
    Route::get('/request', [ExaminationRequestController::class, 'index']); //seznam requestu na pro lečení zvířat
    Route::get('/request/{id}', [ExaminationRequestController::class, 'RequestDetail']);
    Route::get('/request/{id}/edit', [ExaminationRequestController::class,'geteditRequest']);

    Route::post('/request/{id}/edit', [ExaminationRequestController::class,'editRequest']);

    //plánuje termíny prohlídek
    Route::get('/examination', [ExaminationController::class,'IndexExamination'])->name('examination.index');
    Route::get('/examination/{id}', [ExaminationController::class,'DetailExamination']);
    Route::get('/examination/{id}/edit', [ExaminationController::class,'EditDetailExamination']);
    Route::get('/examination/create', [ExaminationController::class,'CreateFormExamination']);

    Route::post('/examination/create', [ExaminationController::class,'createExamination']);
    Route::post('/examination/{id}/delete', [ExaminationController::class,'deleteExamination']);
    Route::post('/examination/{id}/edit', [ExaminationController::class,'editExamination']);

    //udržuje zdravotní záznamy zvířat
    Route::get('/animals/{id}/record', [ExaminationRecordController::class, 'IndexAnimalRecords'])->name('animals.record');
    Route::get('/record/{id}', [ExaminationRecordController::class, 'DetailAnimalRecord']);
    Route::get('/record/{id}/edit', [ExaminationRecordController::class, 'getEditDetailAnimalRecord']);
    Route::get('/animals/{id}/record/create', [ExaminationRecordController::class, 'getCreateAnimalRecord']);
    
    Route::post('/animals/{id}/record/create', [ExaminationRecordController::class, 'createAnimalRecord']);
    Route::post('/record/{id}/edit', [ExaminationRecordController::class, 'editDetailAnimalRecord']);
    Route::post('/record/{id}/delete', [ExaminationRecordController::class, 'deleteDetailAnimalRecord']);
});

Route::middleware(['auth', 'role:Caretaker,Admin'])->group( function (){


    //spravuje zvířata, vede jejich evidenci
    Route::get('/animals/{id}/edit', [AnimalController::class,'edit']);
    Route::get('/animals/create', [AnimalController::class,'create']);

    Route::post('/animals/create', [AnimalController::class,'store']);
    Route::post('/animals/{id}/edit', [AnimalController::class,'update']);
    Route::post('/animals/{id}/delete', [AnimalController::class, 'destroy']);

    //vytváří rozvrhy pro venčení
    Route::get('/animals/{id}/planWalks',[WalkBookingController::class, 'getAnimalPlan']);
    Route::post( '/animals/{id}/planWalks',[WalkBookingController::class, 'postAnimalPlan']);

    //ověřuje dobrovolníky
    Route::get('/approvevolunteers', [UserController::class,'getApproveVolunteers']);
    Route::get('/approvevolunteers/{id}', [UserController::class,'getApproveVolunteersDetail']);
    Route::post('/approvevolunteers/{id}/approve', [UserController::class,'ApproveVolunteer']);


    //schvaluje rezervace zvířat na venčení
    Route::get('/booking',[WalkBookingController::class,'Index']); //all boookings
    Route::get('animals/{id}/booking',[WalkBookingController::class,'AnimalIndex']);
    Route::get('/booking/{id}', [WalkBookingController::class,'Detail']);
    Route::post('/booking/{id}/approve',[WalkBookingController::class,'ApproveBooking']);
    Route::post('/booking/{id}/decline',[WalkBookingController::class,'DeclineBooking']); 


    //eviduje zapůjčení a vrácení
    Route::post('animals/{id}/taken',[AnimalController::class,'animalTaken']);
    Route::post('animals/{id}/returned',[AnimalController::class,'animalReturned']);

    //vytváří požadavky na veterináře
    Route::get('animals/{id}/createrequest',[ExaminationRequestController::class,'create']);
    Route::post('animals/createrequest',[ExaminationRequestController::class,'store']);
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
