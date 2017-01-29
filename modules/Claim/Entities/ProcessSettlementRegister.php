<?php namespace Modules\Claim\Entities;

use App\ProcessEntry;
use Modules\Costumer\Entities\Customer;
use Modules\Policy\Entities\Policy;
use App\UploadAndDownloadFile;
use Illuminate\Http\Request;
use App\User;
use JWTAuth;

class ProcessSettlementRegister extends ProcessEntry {

  use \App\UploadAndDownloadFile;

  function __construct(){
    //call to method start of the
    parent::__construct(array(),'SettlementRegister');
  }

  public function doProcess(Request $request){

  }

  public function getResponsibleID($current=false){
    //the responsible is the user that is currently logged in the application
    return parent::getResponsibleID(false);
  }
}
