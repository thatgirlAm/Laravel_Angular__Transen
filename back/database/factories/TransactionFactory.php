<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {        
        # TODO : set le reverse
        $typesTransaction = ['retrait', 'depot', 'transfert', 'reverse'];
        $randomUserExpId = User::where('admin', 'no')->inRandomOrder()->value('id');        
        $type=$this->faker->randomElement($typesTransaction);
        $randomUserDestId = in_array($type, ['depot', 'retrait']) ? 0 : User::where('admin', 'no')->inRandomOrder()->value('id');        
        $operatorIds= User::where('admin', 'yes')->pluck('id')->toArray();
        $randomNumber = rand(1, 10);
        $idOperator = $randomNumber == 1 ? $this->faker->randomElement($operatorIds) : 0;
        $startDate = Carbon::create(2024, 5, 1);
        $endDate = Carbon::create(2019, 9, 30);
        $reversed = ($type == 'transfert') ? (bool) rand(0, 1) : false;     
        return[
            'created_at'=>Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp))->toDateString(),
            'updated_at'=>Carbon::createFromTimestamp(rand($startDate->timestamp, $endDate->timestamp))->toDateString(),
            'idUserExp'=>$randomUserExpId,
            'idUserDest'=>$randomUserDestId,
            'amount'=>rand(100,180000),
            'type'=>$type,
            'idOperator'=>$idOperator,
            'reversed'=>$reversed

        ];
    }
}
