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
        Schema::create('walk_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('animal_id')->constrained('animals')->cascadeOnDelete();
            $table->dateTime('start');
            $table->dateTime('end');
            $table->boolean('available')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('walk_plans');
    }
};
