<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $vendorRole = Role::firstOrCreate(['name' => 'Vendor']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer']);
        
        // create an admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@myhall.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($adminRole);
    }
}
