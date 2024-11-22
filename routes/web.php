<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnimalController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\CaretakerController;
use App\Http\Controllers\VetController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\WalkBookingController;
use App\Http\Controllers\WalkPlanController;
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
    Route::get('/admin', [AdminController::class, 'index'])->name('admin'); //nejakej default adnim dashboard kdyžkat vyčmoudni

    Route::get('/admin/users', [AdminController::class, 'show_users'])->name('adnim');
    Route::get('/admin/users/{id}', [AdminController::class,'show_detail'])->name('admin');
    Route::get('/admin/users/{id}/edit',[AdminController::class,'show_edit'])->name('admin');
    Route::get('/admin/users/create', [AdminController::class,'show_create'])->name('admin');
    Route::post('/admin/users/create', [AdminController::class, 'create_user'])->name('admin');
    Route::post('/admin/users/{id}/delete', [AdminController::class, 'remove_user'])->name('admin');
    Route::post('/admin/users/{id}/edit', [AdminController::class, 'edit_user'])->name('admin');
});

Route::middleware(['auth', 'role:Volunteer,Admin'])->group( function (){
    Route::get('/volunteer', [VolunteerController::class, 'index'])->name('volunteer'); //nejakej default Volunteer dashboard kdyžkat vyčmoudni

    Route::get('/volunteer/history', [VolunteerController::class, 'getVolunteerHistory']); //jeho historie

    Route::get('/animals/{id}/schedule-volunteer',[VolunteerController::class, 'showAnimalSchedule']);
    Route::post('/animals/{id}/bookTermin', [VolunteerController::class, 'bookTermin']);
    Route::post('/animals/{id}/cancelTermin', [VolunteerController::class, 'cancelTermin']);
});

Route::middleware(['auth', 'role:Vet,Admin'])->group( function (){
    Route::get('/vet', [VetController::class, 'getPetExaminationsAndRecords'])->name('vet'); //nejakej default Vet dashboard kdyžkat vyčmoudni

    //kouka do požadavku
    Route::get('/request', [VetController::class, 'IndexRequests']); //seznam requestu na pro lečení zvířat
    Route::get('/request/{id}', [VetController::class, 'RequestDetail']);
    Route::get('/request/{id}/edit', [VetController::class,'geteditRequest']);

    Route::post('/request/{id}/edit', [VetController::class,'editRequest']);

    //plánuje termíny prohlídek
    Route::get('/examination', [VetController::class,'IndexExamination']);
    Route::get('/examination/{id}', [VetController::class,'DetailExamination']);
    Route::get('/examination/{id}/edit', [VetController::class,'EditDetailExamination']);
    Route::get('/examination/create', [VetController::class,'CreateFormExamination']);

    Route::post('/examination/create', [VetController::class,'createExamination']);
    Route::post('/examination/{id}/delete', [VetController::class,'deleteExamination']);
    Route::post('/examination/{id}/edit', [VetController::class,'editExamination']);

    //udržuje zdravotní záznamy zvířat
    Route::get('/animals/{id}/record', [VetController::class,'IndexAnimalRecords']);
    Route::get('/animals/{id}/record/{id}', [VetController::class,'DetailAnimalRecord']);
    Route::get('/animals/{id}/record/{id}/edit', [VetController::class,'geteditDetailAnimalRecord']);
    Route::get('/animals/{id}/record/create', [VetController::class,'getCreateAnimalRecord']);

    Route::post('/animals/{id}/record/create', [VetController::class,'CreateAnimalRecord']);
    Route::post('/animals/{id}/record/{id}/edit', [VetController::class,'editDetailAnimalRecord']);
    Route::post('/animals/{id}/record/{id}/delete', [VetController::class,'deleteDetailAnimalRecord']);
});

Route::middleware(['auth', 'role:Caretaker,Admin'])->group( function (){


    //spravuje zvířata, vede jejich evidenci
    Route::get('/animals/{id}/edit', [CaretakerController::class,'getAnimalEdit']);
    Route::get('/animals/create', [CaretakerController::class,'getAnimalCreate']);

    Route::post('/animals/create', [CaretakerController::class,'AnimalCreate']);
    Route::post('/animals/{id}/edit', [CaretakerController::class,'AnimalEdit']);
    Route::post('/animals/{id}/delete', [CaretakerController::class, 'AnimalDelete']);

    //vytváří rozvrhy pro venčení
    Route::get('/animals/{id}/planWalks',[CaretakerController::class, 'getAnimalPlan']);
    Route::post( '/animals/{id}/planWalks',[CaretakerController::class, 'getAnimalPlan']);

    //ověřuje dobrovolníky
    Route::get('/approvevolunteers', [CaretakerController::class,'getApproveVolunteers']);
    Route::get('/approvevolunteers/{id}', [CaretakerController::class,'getApproveVolunteersDetail']);
    Route::post('/approvevolunteers/{id}/approve', [CaretakerController::class,'ApproveVolunteer']);


    //schvaluje rezervace zvířat na venčení
    Route::get('/booking',[CaretakerController::class,'Index']); //all boookings
    Route::get('animals/{id}/booking',[CaretakerController::class,'AnimalIndex']);
    Route::get('/booking/{id}', [CaretakerController::class,'Detail']);
    Route::post('/booking/{id}/approve',[CaretakerController::class,'ApproveBooking']);
    Route::post('/booking/{id}/decline',[CaretakerController::class,'DeclineBooking']); 


    //eviduje zapůjčení a vrácení
    Route::post('animals/{id}/taken',[CaretakerController::class,'animalTaken']);
    Route::post('animals/{id}/returned',[CaretakerController::class,'animalReturned']);

    //vytváří požadavky na veterináře
    Route::get('animals/{id}/createrequest',[CaretakerController::class,'getCreateAnimal']);
    Route::post('animals/{id}/createrequest',[CaretakerController::class,'CreateAnimal']);
});



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__.'/auth.php';
