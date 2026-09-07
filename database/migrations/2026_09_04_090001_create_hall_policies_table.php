<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hall_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->cascadeOnDelete();
            
            // Timing & General
            $table->string('event_timing')->nullable()->default('08:00 AM - 11:00 PM');
            $table->string('max_duration')->nullable()->default('12 Hours');
            $table->text('noise_rules')->nullable();
            $table->text('decoration_rules')->nullable();
            $table->text('damage_policy')->nullable();
            $table->text('security_rules')->nullable();

            // Catering
            $table->boolean('veg_allowed')->default(true);
            $table->boolean('non_veg_allowed')->default(true);
            $table->boolean('outside_catering_allowed')->default(true);
            $table->boolean('inhouse_catering_available')->default(false);

            // Decoration
            $table->boolean('outside_decorator_allowed')->default(true);
            $table->boolean('inhouse_decorator_available')->default(false);

            // Other
            $table->string('alcohol_policy')->nullable()->default('Permitted with Excise License');
            $table->string('music_policy')->nullable()->default('Allowed till 10:00 PM as per Govt rules');
            $table->string('fireworks_policy')->nullable()->default('Cold pyros allowed outdoors only');
            $table->string('parking_rules')->nullable()->default('Valet parking available');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hall_policies');
    }
};
