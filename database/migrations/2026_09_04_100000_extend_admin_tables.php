<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->enum('status', ['active', 'suspended'])->default('active')->after('verification_status');
            $table->text('rejection_reason')->nullable()->after('status');
        });

        Schema::table('halls', function (Blueprint $table) {
            $table->text('rejection_reason')->nullable()->after('status');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['active', 'blocked'])->default('active')->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropColumn(['status', 'rejection_reason']);
        });

        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn('rejection_reason');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
