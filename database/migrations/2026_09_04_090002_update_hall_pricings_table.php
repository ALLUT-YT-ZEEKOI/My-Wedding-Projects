<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hall_pricings', function (Blueprint $table) {
            $table->decimal('morning_price', 10, 2)->nullable()->after('base_price');
            $table->decimal('evening_price', 10, 2)->nullable()->after('morning_price');
            $table->decimal('full_day_price', 10, 2)->nullable()->after('evening_price');

            $table->decimal('weekday_price', 10, 2)->nullable()->after('full_day_price');
            $table->decimal('weekend_price', 10, 2)->nullable()->after('weekday_price');
            $table->decimal('holiday_price', 10, 2)->nullable()->after('weekend_price');

            $table->decimal('security_deposit', 10, 2)->nullable()->default(10000.00)->after('holiday_price');
            $table->decimal('extra_hour_charge', 10, 2)->nullable()->default(2000.00)->after('security_deposit');
            $table->decimal('cleaning_charge', 10, 2)->nullable()->default(3000.00)->after('extra_hour_charge');
            $table->decimal('electricity_charge', 10, 2)->nullable()->default(0.00)->after('cleaning_charge');
            $table->decimal('room_charge', 10, 2)->nullable()->default(1500.00)->after('electricity_charge');
            $table->decimal('other_charges', 10, 2)->nullable()->default(0.00)->after('room_charge');
        });
    }

    public function down(): void
    {
        Schema::table('hall_pricings', function (Blueprint $table) {
            $table->dropColumn([
                'morning_price', 'evening_price', 'full_day_price',
                'weekday_price', 'weekend_price', 'holiday_price',
                'security_deposit', 'extra_hour_charge', 'cleaning_charge',
                'electricity_charge', 'room_charge', 'other_charges'
            ]);
        });
    }
};
