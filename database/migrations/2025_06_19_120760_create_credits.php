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
        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->decimal('balance', 10, 2);
            $table->decimal('amount_paid', 10, 2);

            $table->dateTime('due_date')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->timestamps();

            $table->index('sale_id');
            $table->index('due_date');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credits');
    }
};
