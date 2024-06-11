<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $typesCompte = ['orangeMoney', 'wave'];
        $startDate = Carbon::create(2024, 5, 1);
        $endDate = Carbon::create(2019, 9, 30);
        $admin =['yes', 'no'];
        return [
            'name' => fake()->name(),
            'surname'=>fake()->lastName(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'number'=>rand(776215896,789999990),
            'dateOfBirth'=>fake()->date(),
            'balance'=>rand(750,200000),
            'typeDeCompte'=>Arr::random($typesCompte),
            'created_at'=>Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp))->toDateString(),
            'updated_at'=>Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp))->toDateString(),
            'admin'=>Arr::random($admin),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
