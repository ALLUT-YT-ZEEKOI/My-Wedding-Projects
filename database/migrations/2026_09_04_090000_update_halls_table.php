<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('halls', function (Blueprint $table) {
            $table->string('hall_type')->default('Banquet Hall')->after('name');
            $table->string('contact_number')->nullable()->after('description');
            $table->string('email')->nullable()->after('contact_number');
            $table->text('address')->nullable()->after('email');
            $table->string('city')->default('Mumbai')->after('address');
            $table->string('area')->nullable()->after('city');
            $table->string('pincode')->nullable()->after('area');
            $table->text('map_url')->nullable()->after('pincode');
            $table->string('landmark')->nullable()->after('map_url');

            $table->integer('seating_capacity')->nullable()->after('capacity');
            $table->integer('dining_capacity')->nullable()->after('seating_capacity');
            $table->integer('floating_capacity')->nullable()->after('dining_capacity');
            $table->integer('min_guests')->nullable()->after('floating_capacity');
            $table->integer('max_guests')->nullable()->after('min_guests');

            $table->string('cover_photo')->nullable()->after('status');
            $table->string('video_url')->nullable()->after('cover_photo');
        });
    }

    public function down(): void
    {
        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn([
                'hall_type', 'contact_number', 'email', 'address', 'city', 'area',
                'pincode', 'map_url', 'landmark', 'seating_capacity', 'dining_capacity',
                'floating_capacity', 'min_guests', 'max_guests', 'cover_photo', 'video_url'
            ]);
        });
    }
};
