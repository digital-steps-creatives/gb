<?php namespace Modules\Quotation\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class QuotationDatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();
		$this->call("\Modules\Quotation\Database\Seeders\PermissionQuotationTableSeeder");
		$this->call("\Modules\Quotation\Database\Seeders\EmailQuotationTableSeeder");
	}

}