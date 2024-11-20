<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('examination_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animals')->cascadeOnDelete();
            $table->foreignId('vet_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('examination_date');
            $table->enum('examination_type', ['ockovani', 'prohlidka', 'lecba']);
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examination_records');
    }
};
