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
        Schema::create('customers', function (Blueprint $table) {

            $table->id();
            $table->uuid()->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone');
            $table->string('email') -> nullable();
            $table->string('home')->nullable();
            $table->string('house_number')->nullable();
            $table->string('note')->nullable();
            $table->enum('bill_cycle', ['daily', 'weekly', 'monthly'])->default('daily');
            $table->timestamps();
            $table->index('uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
