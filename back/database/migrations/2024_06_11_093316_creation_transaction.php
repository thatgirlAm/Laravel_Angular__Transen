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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('idUserExp')->constrained('users', 'id');
            $table->integer('idUserDest');
            $table->double('amount');
            $table->enum('type', ['retrait', 'depot', 'transfert', 'reverse']);
            $table->integer('idOperator')->nullable();
            $table->boolean('reversed')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
