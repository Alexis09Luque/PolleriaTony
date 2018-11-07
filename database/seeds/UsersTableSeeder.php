<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
    
        // User::create([
        //     'id'=>1,
        //     'name' => 'Jose Francisco Mateo Carrasco',
        //     'code' => 'jose.mc@admin.com',
        //     'password' => bcrypt('admin'),
        //     'type'=> 1,
        // ]);
        // User::create([
        //     'id'=>2,
        //     'name' => 'Juan Alexis Luque Ayala',
        //     'code' => 'alexis.la@admin.com',
        //     'password' => bcrypt('admin'),
        //     'type'=> 3,
        // ]);
        // User::create([
        //     'id'=>3,
        //     'name' => 'Antoni Bancayan',
        //     'code' => 'antoni.b@admin.com',
        //     'password' => bcrypt('admin'),
        //     'type'=> 2,
        // ]);
        User::create([
            'id'=>1,
            'name' => 'Anonimo',
            'lastname'=> 'Sin Apellido',
            'dni'=> '77041708',
            'dateOfBirth'=> null,
            'cellphone'=>'987654321',
            'email'=> 'anonimo@gmail.com',
            'office'=> 1,
            'photo'=> null,

            'code' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            
        ]);


    }
}
