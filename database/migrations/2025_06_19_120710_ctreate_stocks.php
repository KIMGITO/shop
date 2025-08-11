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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('product_id') // singular
                ->nullable()              // required for nullOnDelete
                ->constrained('products') // points to the 'products' table
                ->cascadeOnDelete();         // sets foreign key to NULL on delete
            $table->string('code')->unique();
            $table->decimal('quantity_received', 10, 2);
            $table->decimal('quantity_available', 10, 2);
            $table->date('date');
            $table->string('source')->default('4&8 Daily Farm')->nullable(); // e.g. "Own Farm"
            $table->timestamps();
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
        
    }
};
