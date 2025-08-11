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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name');         // e.g. Milk, Mala, Eggs
            $table->string('unit');         // e.g. Litre, Packet
            $table->decimal('price_per_unit', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_updaterble')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
