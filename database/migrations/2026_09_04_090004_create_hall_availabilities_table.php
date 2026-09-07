<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hall_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->enum('slot', ['morning', 'evening', 'full_day'])->default('full_day');
            $table->enum('status', ['available', 'pending', 'booked', 'blocked'])->default('available');
            $table->string('reason')->nullable();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();

            $table->timestamps();

            $table->unique(['hall_id', 'date', 'slot']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hall_availabilities');
    }
};
