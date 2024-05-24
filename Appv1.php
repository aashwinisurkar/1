<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Appv1 extends MY_Controller {

    function __construct()
    {
        parent::__construct();
        $this->load->model('common_model');
        $this->load->database();
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
        header("Access-Control-Allow-Headers: *");

        /*cache control*/
        $this->output->set_header('Last-Modified: ' . gmdate("D, d M Y H:i:s") . ' GMT');
        $this->output->set_header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
        $this->output->set_header('Pragma: no-cache');
        $this->output->set_header("Expires: Mon, 26 Jul 2010 05:00:00 GMT");
    }
	

    function login()
    {

//         SELECT * FROM plaza_report where plaza_code =1
// order by date_rep
// limit 1;

// SELECT pr.plaza_code,
//        pm.name,
//        pr.date_rep,
//        SUM(pr.total_cash_recievable) AS cash_1,
//        SUM(pr.balaji) AS cash_2,
//        SUM(pr.monthly_pass_amt) AS monthly_pass_amount,
//        SUM(pr.gross_cash_rec) AS gross_cash_rec,
//        SUM(pr.total_fast_tag_cl) AS total_fast_tag_cl,
//        SUM(pr.cash_kpt) AS expense_from_tp,
//        SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) AS total_coll,
//        SUM(pr.remittance) AS agreed_remittance,
//        (SELECT IFNULL(SUM(amount),0) FROM ho_expense WHERE date_rep BETWEEN '2024-03-11' AND '2024-03-17') AS total_expense_from_ho,
//        (SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) + SUM(pr.cash_kpt) - SUM(pr.remittance)) AS margin_without_expense
// FROM plaza_report pr
// JOIN plaza_master pm ON pr.plaza_code = pm.plaza_id
// WHERE pr.date_rep BETWEEN '2024-03-11' AND '2024-03-17'
// GROUP BY pr.plaza_code, pr.date_rep;
// SELECT pr.plaza_code,
// pm.name,
// ('2024-03-11') as from_date,
// ('2024-03-17') as to_date,
// SUM(pr.total_cash_recievable) AS cash_1,
// SUM(pr.balaji) AS cash_2,
// SUM(pr.monthly_pass_amt) AS monthly_pass_amount,
// SUM(pr.gross_cash_rec) AS gross_cash_rec,
// SUM(pr.total_fast_tag_cl) AS total_fast_tag_cl,
// SUM(pr.cash_kpt) AS expense_from_tp,
// SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) AS total_coll,
// SUM(pr.remittance) AS agreed_remittance,
// (SELECT IFNULL(SUM(amount),0) FROM ho_expense WHERE date_rep BETWEEN '2024-03-11' AND '2024-03-17') AS total_expense_from_ho,
// (SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) + SUM(pr.cash_kpt) - SUM(pr.remittance)) AS margin_without_expense
// FROM plaza_report pr
// JOIN plaza_master pm ON pr.plaza_code = pm.plaza_id
// WHERE pr.date_rep BETWEEN '2024-03-11' AND '2024-03-17'
// GROUP BY pr.plaza_code ;
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
            echo json_encode($returnArr);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if($data['email'] == ''  or $data['password'] == '')
        {
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
        }
        else
        {
            $mobile =$data['email'];
            //$imei = $data['imei'];
            $password = md5($data['password']);
            $credential	=	array('email' => $mobile , 'password' => $password);



            
            $this->db->select('users.id,users.name, email, mobile, users.is_active as status, role_master.roll_name as role, temporary_token as token, plaza_assign as pid, role_id as rid,plaza_master.is_active as plaza_stat');
            $this->db->from('users');
            $this->db->join('role_master', 'users.role_id = role_master.roll_code');
            $this->db->join('plaza_master', 'users.plaza_assign = plaza_master.plaza_id');
            $this->db->where($credential);
            $query = $this->db->get();

            if ($query->num_rows() > 0) {
                $c = $query->row();
                if($c->status=='1'){
                    if($c->rid == '4' || $c->rid == '2'){
                        $returnArr = array("user"=>$c,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Login successfully!");
                    // $c->id  $c->pid
                    $insert = array(
                        'action' => 'User Logged In',
                        'user_id' => $c->id,
                        'toll_id'=>$c->pid,
                        "ip_address" => $this->input->ip_address()
                    );
                    $this->db->insert('log_maintain', $insert);
                    }else{
                    if($c->plaza_stat == '1' ){
                        // || $c->plaza_stat == '0'
                    $returnArr = array("user"=>$c,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Login successfully!");
                    // $c->id  $c->pid
                    $insert = array(
                        'action' => 'User Logged In',
                        'user_id' => $c->id,
                        'toll_id'=>$c->pid,
                        "ip_address" => $this->input->ip_address()
                    );
                    $this->db->insert('log_maintain', $insert);
                }else{
                    $returnArr = array("ResponseCode"=>"403","Result"=>"false","ResponseMsg"=>"Access Denied");
                }
            }
                }
                else{                   
                    $returnArr = array("ResponseCode"=>"403","Result"=>"false","ResponseMsg"=>"Invalid Email/Mobile No or Password!!!");
                }
            }
            else
            {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Invalid Email/Mobile No or Password!!!");
            }
           
        //     $query = "SELECT
        // plaza_master.plaza_id,
        // plaza_master.name,
        // COALESCE(plaza_report.total_coll, 0) AS total_coll,
        // plaza_master.remitance,
        // FROM plaza_master
        // LEFT JOIN plaza_report ON plaza_master.plaza_id = plaza_report.plaza_code AND plaza_report.date_rep = '$date'
        // WHERE plaza_master.is_active = 1
        // ORDER BY plaza_master.plaza_id;";
        $query5 = " UPDATE plaza_master
         SET exp_id = 0
        WHERE valid_to < CURDATE();";

        // $result = $this->db->query($query)->result();
        $result = $this->db->query($query5);

           echo json_encode($returnArr);       
      
        }    

    }

    // last entry find start
    // function getend(){
    //     $data = json_decode(file_get_contents('php://input'),true);
    //     $plaza = $data['plaza'];
    //     $query = "SELECT date_rep as Last_entry 
    //     FROM plaza_report where plaza_code = $plaza 
    //     order by date_rep desc limit 1;";

    //     $result = $this->db->query($query)->result();

    //     if (!empty($result)) {
    //         // If there are rows, send the normal response
    //         $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
    //         echo json_encode($responses);
    //     } else {
    //         // If there are no rows, send an alternative response
    //         $alternativeResponse = array("ResponseCode" => "404", "Result" => "false", "Message" => "No data found");
    //         echo json_encode($alternativeResponse);
    //     }

    // }

    // function getend(){
    //     $data = json_decode(file_get_contents('php://input'), true);
    //     $plaza = $data['plaza'];
    //     $query = "SELECT date_rep as Last_entry 
    //                 FROM plaza_report 
    //                 WHERE plaza_code = $plaza 
    //                 ORDER BY date_rep DESC 
    //                 LIMIT 1;";
    //     $result = $this->db->query($query)->result();
    
    //     if (!empty($result)) {
    //         // If there are rows, send the normal response
    //         $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
    //         echo json_encode($responses);
    //     } else {
    //         // If there are no rows, send an alternative response with current date
    //         $alternativeResponse = array(
    //             "ResponseCode" => "202", 
    //             "Result" => "false", 
    //             "Message" => "No data found",
    //             "Data" => array(          
    //                                 array("Last_entry" => date('Y-m-d'))  
    //                             )
    //         );
    //         echo json_encode($alternativeResponse);
    //     }
    // }

    function getend(){
        $data = json_decode(file_get_contents('php://input'), true);
        $plaza = $data['plaza'];
        $query = "SELECT date_rep as Last_entry 
                    FROM plaza_report 
                    WHERE plaza_code = $plaza 
                    ORDER BY date_rep DESC 
                    LIMIT 1;";
        $result = $this->db->query($query)->result();
    
        if (!empty($result)) {
            // If there are rows, send the normal response
            $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
            echo json_encode($responses);
        } else {
            // If there are no rows, send an alternative response with current date
            $plaza = $data['plaza'];
        $query = "select valid_from as Last_entry
        from plaza_master where plaza_id = $plaza ;";
        $result = $this->db->query($query)->result();
        $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
        echo json_encode($responses);
        }
    }

    function tollexpense_detail(){
        $data = json_decode(file_get_contents('php://input'), true);
        $from = $data['from'];
            $to = $data['to'];
        
        if(empty($data['plaza_code']) && empty($data['exp_id'])   ){
            $query = "SELECT plaza_report_detail.date_rep,plaza_master.name AS plaza,expense_master.name AS expense,
            plaza_report_detail.amount AS amount,plaza_report_detail.narration AS narration
            FROM plaza_report_detail
            LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_report_detail.plaza_code
            LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id AND plaza_report_detail.is_active=1
            WHERE plaza_report_detail.date_rep BETWEEN '$from' AND '$to'
            ORDER BY date_rep asc;";
            $result = $this->db->query($query)->result_array();
            echo json_encode($result);
            exit;
        }

        if(!empty($data['plaza_code']) && empty($data['exp_id'])   ){
            $plaza = $data['plaza_code'];
            $query = "SELECT plaza_report_detail.date_rep,plaza_master.name AS plaza,expense_master.name AS expense,
            plaza_report_detail.amount AS amount,plaza_report_detail.narration AS narration
            FROM plaza_report_detail
            LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_report_detail.plaza_code
            LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id
            WHERE plaza_report_detail.date_rep BETWEEN '$from' AND '$to' AND plaza_report_detail.plaza_code = $plaza AND plaza_report_detail.is_active=1
            ORDER BY date_rep asc;";
            $result = $this->db->query($query)->result_array();
            echo json_encode($result);
            exit;
        }

        if(empty($data['plaza_code']) && !empty($data['exp_id'])   ){
            $exp_id = $data['exp_id'];
            $query = "SELECT plaza_report_detail.date_rep,plaza_master.name AS plaza,expense_master.name AS expense,
            plaza_report_detail.amount AS amount,plaza_report_detail.narration AS narration
            FROM plaza_report_detail
            LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_report_detail.plaza_code
            LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id
            WHERE plaza_report_detail.date_rep BETWEEN '$from' AND '$to' AND plaza_report_detail.exp_id = $exp_id  AND plaza_report_detail.is_active=1
            ORDER BY date_rep asc;";
            $result = $this->db->query($query)->result_array();
            echo json_encode($result);
            exit;
        }

        if(!empty($data['plaza_code']) && !empty($data['exp_id'])   ){
            $exp_id = $data['exp_id'];
            $plaza = $data['plaza_code'];
            $query = "SELECT plaza_report_detail.date_rep,plaza_master.name AS plaza,expense_master.name AS expense,
            plaza_report_detail.amount AS amount,plaza_report_detail.narration AS narration
            FROM plaza_report_detail
            LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_report_detail.plaza_code
            LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id
            WHERE plaza_report_detail.date_rep BETWEEN '$from' AND '$to' AND plaza_report_detail.exp_id = $exp_id AND plaza_report_detail.plaza_code = $plaza AND plaza_report_detail.is_active=1
            ORDER BY date_rep asc;";
            $result = $this->db->query($query)->result_array();
            echo json_encode($result);
            exit;
        }
    
    }
    // last entry find end
    
    public function cpass() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id2'];
        $password = md5($data['pass']);
        $newPassword = md5($data['newpass']);
    
        
        $credential = array('id' => $id, 'password' => $password);
        $userExists = $this->db->get_where('users', $credential)->row();
    
        if ($userExists) {
            
            $this->db->where('id', $id);
            $this->db->update('users', array('password' => $newPassword));
    
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "User Updated");
            echo json_encode($response);
        } else {
            
            $response = array("ResponseCode" => "400", "Result" => "false", "ResponseMsg" => "Invalid ID or password");
            echo json_encode($response);
        }
        exit;
    }

    function expensehead(){
        $this->db->select('id,name,show_in');
        $this->db->order_by('name','asc');
        $row_count = $this->db->get_where('expense_master',array("is_active"=>1))->result_array();
        echo json_encode($row_count);
    }
    

    function logout(){
        $data = json_decode(file_get_contents('php://input'), true);
        $insert = array(
            'action' => 'User Logged Out',
            'user_id' => $data['uid'],
            'toll_id'=>  $data['pid'],
            "ip_address" => $this->input->ip_address()
        );
        $this->db->insert('log_maintain', $insert);
    }


function monthlysalesamount()
{
    
    $year=date('Y');
    $numbery=date('y');
    $prevyear=$numbery-1;
    $prevyearformat=$year-1;
    $syear='';
    $syearformat='';
   for($k = 1; $k < 13; $k++){
    $month=date('m', strtotime("+$k month")); 
    $gety= date('y', strtotime("+$k month")); 
    if($gety==$numbery){
        $syear= $prevyear;
        $syearformat= $prevyearformat;
        }
    else{
         $syear=$numbery;
         $syearformat= $year;
        }

        // echo $syearformat;
        // echo $syear;
        // exit;
        $wherequery = "YEAR(date_rep)='$syearformat' AND MONTH(date_rep)='$month'";
        $this->db->select('count(*) as entries, IFNULL(SUM(total_coll), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);

        $query = $this->db->get();

        $result = $query->row();

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), 
            "month" => $month,
            "year" => $syearformat
        );

    }


    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;





    $months = range(1, 12); 

    $fdata = array();

    // Loop through each month and fetch data
    foreach ($months as $month) {
        $wherequery = "YEAR(date_rep)='$year' AND MONTH(date_rep)='$month'";
        $this->db->select('count(*) as entries, IFNULL(SUM(total_coll), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);
        $query = $this->db->get();

        $result = $query->row();

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), 
            "month" => $month,
            
        );
    }

    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;
}


function monthlyplazasalesamount(){

    $data = json_decode(file_get_contents('php://input'), true);
    $plaza_code = $data['plaza'];

    $year=date('Y');
    $numbery=date('y');
    $prevyear=$numbery-1;
    $prevyearformat=$year-1;
    $syear='';
    $syearformat='';
   for($k = 1; $k < 13; $k++){
    $month=date('m', strtotime("+$k month")); 
    $gety= date('y', strtotime("+$k month")); 
    if($gety==$numbery){
        $syear= $prevyear;
        $syearformat= $prevyearformat;
        }
    else{
         $syear=$numbery;
         $syearformat= $year;
        }

        

        $wherequery = "YEAR(date_rep)='$syearformat' AND MONTH(date_rep)='$month' AND plaza_code='$plaza_code'";
        $this->db->select('count(*) as entries, IFNULL(SUM(total_coll), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);
        $query = $this->db->get();

        $result = $query->row();

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), 
            "month" => $month,
            "year" => $syearformat
        );

    }


    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;
}
    // plaza wise monthly sales amount 
    
    // get monthly expense start
    function monthlyexpemseamount()
{
    // $data = json_decode(file_get_contents('php://input'), true);
    // $year = $data['year'];


    //test start
    $year=date('Y');
    $numbery=date('y');
    $prevyear=$numbery-1;
    $prevyearformat=$year-1;
    $syear='';
    $syearformat='';
   for($k = 1; $k < 13; $k++){
    $month=date('m', strtotime("+$k month")); 
    $gety= date('y', strtotime("+$k month")); 
    if($gety==$numbery){
        $syear= $prevyear;
        $syearformat= $prevyearformat;
        }
    else{
         $syear=$numbery;
         $syearformat= $year;
        }

       

        $wherequery = "YEAR(date_rep)='$syearformat' AND MONTH(date_rep)='$month'";
        $this->db->select('count(*) as entries, IFNULL(SUM(cash_kpt), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);
        $query = $this->db->get();

        $result = $query->row();

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), 
            "month" => $month,
            "year" => $syearformat
        );

    }


    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;
    //test end
    $months = range(1, 12); // Array representing months 1 to 12

    $fdata = array();

    // Loop through each month and fetch data
    foreach ($months as $month) {
        $wherequery = "YEAR(date_rep)='$year' AND MONTH(date_rep)='$month'";
        $this->db->select('count(*) as entries, IFNULL(SUM(cash_kpt), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);
        $query = $this->db->get();

        $result = $query->row(); // Use row instead of result

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), // Round to 2 decimal places
            "month" => $month
        );
    }

    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;
}
    
function hoexpenserep(){
    try{
    $data = json_decode(file_get_contents('php://input'), true);
    if(!empty($data['expensetype'])){
        foreach ($data['expensetype'] as $expense) {
            $insert_plaza_report_detail = array(
                'date_rep' => $data['date_rep'],
                'exp_id' => $expense['id'],
                'amount' => $expense['amount'],
                'voucher_no' => $expense['voucherno'],
                'narration' => $expense['narration'],
                'is_active'=>'1',
                'plaza_code'=>$data['plaza_code'],
                'user_id' =>$data['user_id'],
                'ip_address' => $this->input->ip_address(),
                'report_id'=>$data['rid']
            );

            $this->db->insert('ho_expense',$insert_plaza_report_detail);
        }
        $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data Inserted Successfully!");
        echo json_encode($response);
        exit;
    }
}catch(Exception $e){
    $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Some Error Occurred!");
    echo json_encode($response);
    exit;
}
    // $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
}

function monthlyplazaexpemseamount(){
    $data = json_decode(file_get_contents('php://input'), true);
    $plaza_code = $data['plaza'];
    $year=date('Y');
    $numbery=date('y');
    $prevyear=$numbery-1;
    $prevyearformat=$year-1;
    $syear='';
    $syearformat='';
   for($k = 1; $k < 13; $k++){
    $month=date('m', strtotime("+$k month")); 
    $gety= date('y', strtotime("+$k month")); 
    if($gety==$numbery){
        $syear= $prevyear;
        $syearformat= $prevyearformat;
        }
    else{
         $syear=$numbery;
         $syearformat= $year;
        }

        

        $wherequery = "YEAR(date_rep)='$year' AND MONTH(date_rep)='$month' AND plaza_code = '$plaza_code'";
        $this->db->select('count(*) as entries, IFNULL(SUM(cash_kpt), 0) as amount, MONTH(date_rep) as month');
        $this->db->from('plaza_report');
        $this->db->where($wherequery, NULL, FALSE);
        $query = $this->db->get();

        $result = $query->row();

        $fdata[] = array(
            "entries" => $result->entries,
            "amount" => round($result->amount, 2), 
            "month" => $month,
            "year" => $syearformat
        );

    }


    $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
    echo json_encode($returnArr);
    return;
}
    // get plaza wise monthly expense end
    // GET PLAZA
    function getplazadata() {
        // $this->db->select('*');
        // $result = $this->db->get('plaza_master')->result();
        // echo json_encode($result);
        // return;
        $this->db->select('*');
        $this->db->order_by('name','asc');
        $this->db->where('is_active', 1);
        $result = $this->db->get('plaza_master')->result();
        echo json_encode($result);
        return;
    }    
    // GET PLAZA END 
    // get download report
    function generate_report(){
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS,*");
            header("Access-Control-Allow-Headers: *");
            header("Access-Control-Allow-Credentials: true");
            http_response_code(300);
            // echo "hello";
            //  exit;
        }

        

        $data_input = json_decode(file_get_contents('php://input'),true);
        // if(empty($data_input)){
        //      echo "hello";
        //      exit;
        // }
//         $query = "SELECT
//     plaza_master.plaza_id,
//     plaza_master.name,
//     COALESCE(SUM(pr.initial_opn + pr.diff_cash_tp),
//         COALESCE((SELECT (COALESCE(pr2.initial_opn, 0) + COALESCE(pr2.diff_cash_tp, 0)) AS last_row_sum
//                   FROM plaza_report AS pr2
//                   WHERE pr2.plaza_code = plaza_master.plaza_id AND pr2.date_rep<'$date'
//                   ORDER BY pr2.date_rep DESC LIMIT 1), 0)) AS oa
// FROM
//     plaza_master
// LEFT JOIN
//     plaza_report AS pr ON plaza_master.plaza_id = pr.plaza_code AND pr.date_rep = '$date'
// GROUP BY
//     plaza_master.plaza_id;";

//     // $result = $this->
//     $result = $this->db->query($query)->result_array();
        //
        $plaza_code = $data_input['plaza_code'];
        $to = $data_input['to'];
        $from =  $data_input['from'];
        // $this->db->select('plaza_report.*,users.name as operator,plaza_master.name as plaza_name');
        //       $this->db->order_by('date_rep','asc');
        //       $this->db->join('users', 'plaza_report.user_id=users.id');
        //       $this->db->join('plaza_master', 'plaza_report.plaza_code=plaza_master.plaza_id');
        // $rows=$this->db->get_where('plaza_report',array('date_rep>=' => $from,'date_rep<='=> $to,'plaza_code'=>$plaza_code))->result_array();
        $query = "SELECT
        plaza_report.*, 
        users.name AS operator, 
        plaza_master.name AS plaza_name, 
        (SELECT IFNULL(SUM(plaza_report_detail.amount),0) 
         FROM plaza_report_detail
         LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id
         WHERE plaza_report_detail.plaza_code = $plaza_code
         AND plaza_report_detail.report_id = plaza_report.id
         AND plaza_report_detail.is_active = 1
         AND expense_master.show_in = 0
         ) AS exp_not
    FROM
        plaza_report
    LEFT JOIN
        users ON plaza_report.user_id = users.id
    LEFT JOIN 
        plaza_master ON plaza_report.plaza_code = plaza_master.plaza_id
    WHERE
        plaza_report.date_rep >= '$from'
        AND plaza_report.date_rep <= '$to' 
        AND plaza_report.plaza_code = $plaza_code;";

        $result = $this->db->query($query)->result_array();
        $returnArr =array("data"=>$result,"ResponseCode"=>"200");
        echo json_encode($returnArr);


    //     SELECT
    //     plaza_report.*, 
    //     users.name AS operator, 
    //     plaza_master.name AS plaza_name, 
    //     (SELECT SUM(plaza_report_detail.amount) 
    //      FROM plaza_report_detail
    //      LEFT JOIN expense_master ON expense_master.id = plaza_report_detail.exp_id
    //      WHERE plaza_report_detail.plaza_code = 20
    //      AND plaza_report_detail.report_id = plaza_report.id
    //      AND plaza_report_detail.is_active = 1
    //      AND expense_master.show_in = 1
    //      ) AS exp_not
    // FROM
    //     plaza_report
    // LEFT JOIN
    //     users ON plaza_report.user_id = users.id
    // LEFT JOIN 
    //     plaza_master ON plaza_report.plaza_code = plaza_master.plaza_id
    // WHERE
    //     plaza_report.date_rep >= '2024-04-01'
    //     AND plaza_report.date_rep <= '2024-04-05' 
    //     AND plaza_report.plaza_code = 20;
        
    }
    // end get report
// get show report start
function generate_report_det(){
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS,*");
        header("Access-Control-Allow-Headers: *");
        header("Access-Control-Allow-Credentials: true");
        http_response_code(300);
        // echo "hello";
        //  exit;
    }

    // if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    //     $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
    //     echo json_encode($returnArr);
    //     return;
    // }

    $data_input = json_decode(file_get_contents('php://input'),true);
    //     SELECT plaza_report.*, users.name AS operator, plaza_master.name AS plaza_name
// FROM plaza_report
// JOIN users ON plaza_report.user_id = users.id
// JOIN plaza_master ON plaza_report.plaza_code = plaza_master.plaza_id
// WHERE date_rep >= '2024-02-01' AND date_rep <= '2024-02-20' AND plaza_report.plaza_code = 4;
    $report_id = $data_input['report_id'];
    // $to = $data_input['to'];
    // $from =  $data_input['from'];
    // $this->db->select('plaza_report.*,users.name as operator,plaza_master.name as plaza_name');
    //       $this->db->order_by('date_rep','asc');
    //       $this->db->join('users', 'plaza_report.user_id=users.id');
    //       $this->db->join('plaza_master', 'plaza_report.plaza_code=plaza_master.plaza_id');
    // $rows=$this->db->get_where('plaza_report',array('date_rep>=' => $from,'date_rep<='=> $to,'plaza_code'=>$plaza_code))->result_array();
    // UPDATE plaza_master
    // SET is_active = 0
    // WHERE valid_to < CURDATE();
    $this->db->select('exp_id as id,amount,voucher_no as voucherno,narration');
    $rows = $this->db->get_where('plaza_report_detail',array('report_id'=>$report_id,'is_active'=>1))->result_array();
    $returnArr =array("data"=>$rows,"ResponseCode"=>"200");
    echo json_encode($returnArr);

}
// get show report end
    function getstat(){
        $this->db->select_sum('total_coll', 'total_collection_sum');
    $result = $this->db->get('plaza_report')->row_array();

    $this->db->select_sum('cash_kpt', 'expense');
    $exp = $this->db->get('plaza_report')->row_array();

    $this->db->select_sum('total_fast_tag_cl', 'fst');
    $fast = $this->db->get('plaza_report')->row_array();


    $this->db->select('*');
    $row_count = $this->db->get_where('plaza_master',array("exp_id"=>1));
    $count = $row_count->num_rows();

    $returnArr = array(
        "data" => array("total_collection_sum" => $result['total_collection_sum'],"Expense" => $exp['expense'],"fast"=>$fast['fst'],"plaza"=>$count,),
        "ResponseCode" => "200"
    );

    echo json_encode($returnArr);
    }
    //specific plaza stat 
    function getplazastat() {
        // plaza_code
        $data_input = json_decode(file_get_contents('php://input'),true);
        $plaza_code = $data_input['plaza'];
        
        $this->db->select_sum('total_coll', 'total_collection_sum');
        $this->db->where('plaza_code', $plaza_code);
        $result = $this->db->get('plaza_report')->row_array();
    
        
        $this->db->select_sum('cash_kpt', 'expense');
        $this->db->where('plaza_code', $plaza_code);
        $exp = $this->db->get('plaza_report')->row_array();
    
        
        $this->db->select_sum('total_fast_tag_cl', 'fst');
        $this->db->where('plaza_code', $plaza_code);
        $fast = $this->db->get('plaza_report')->row_array();
    
        $this->db->select('name');
        $this->db->where('plaza_id', $plaza_code);
        $row_count = $this->db->get('plaza_master')->row_array();
        // $count = $row_count->num_rows();
    
        
        $returnArr = array(
            "data" => array(
                "total_collection_sum" => $result['total_collection_sum'],
                "Expense" => $exp['expense'],
                "fast" => $fast['fst'],
                "plaza" => $row_count['name'],
            ),
            "ResponseCode" => "200"
        );
    
        // Send the JSON response
        echo json_encode($returnArr);
    }
    
    //

    // detailed collection
    function detailcoll(){

        $this->db->select('plaza_master.plaza_id,plaza_master.name,sum(plaza_report.total_coll) as total_collection');
        $this->db->join('plaza_master','plaza_report.plaza_code = plaza_master.plaza_id');
        $this->db->group_by('plaza_report.plaza_code');
        $rows=$this->db->get('plaza_report')->result_array();
        $returnArr = array(
            "data" => $rows,
            "ResponseCode" => "200"
        );
        echo json_encode($returnArr);
    }
    // detailed collection ends
    // SELECT plaza_master.plaza_id,plaza_master.name, SUM(plaza_report.total_coll) AS total_collection,total_coll
    // FROM plaza_report
    // INNER JOIN plaza_master ON plaza_report.plaza_code = plaza_master.plaza_id
    // GROUP BY plaza_master.plaza_id;
     // FUNCTION FOR INSERTING DATA IN PLAZA REPORT
     // detail expense
     function detailexp(){

        $this->db->select('plaza_master.plaza_id,plaza_master.name,sum(plaza_report.cash_kpt) as total_collection');
        $this->db->join('plaza_master','plaza_report.plaza_code = plaza_master.plaza_id');
        $this->db->group_by('plaza_report.plaza_code');
        $rows=$this->db->get('plaza_report')->result_array();
        $returnArr = array(
            "data" => $rows,
            "ResponseCode" => "200"
        );
        echo json_encode($returnArr);
    }
     // detail expense end
     // detail fast tag
     function detailfst(){

        $this->db->select('plaza_master.plaza_id,plaza_master.name,sum(plaza_report.total_fast_tag_cl) as total_collection');
        $this->db->join('plaza_master','plaza_report.plaza_code = plaza_master.plaza_id');
        $this->db->group_by('plaza_report.plaza_code');
        $rows=$this->db->get('plaza_report')->result_array();
        $returnArr = array(
            "data" => $rows,
            "ResponseCode" => "200"
        );
        echo json_encode($returnArr);
    }
     // detail fast tag end 

     // detail plaza
     function detailplaza(){
        // gethostbyaddr($_SERVER['REMOTE_ADDR']);
        $this->db->select('name,addr,valid_from,valid_to');
        $rows=$this->db->get_where('plaza_master',array('is_active'=>1))->result_array();
        $returnArr = array(
            "data" => $rows,
            "ResponseCode" => "200"
        );
        echo json_encode($returnArr);
    }

    function detailplaza1(){
        // gethostbyaddr($_SERVER['REMOTE_ADDR']);
        $this->db->select('name,addr,valid_from,valid_to');
        $this->db->order_by('valid_to','asc');
        $rows=$this->db->get_where('plaza_master',array('exp_id'=>1))->result_array();
        $returnArr = array(
            "data" => $rows,
            "ResponseCode" => "200"
        );
        echo json_encode($returnArr);

//         select name,addr,valid_from,valid_to
// from plaza_master
// where exp_id = 1
// order by valid_to;
    }
     // detail Plaza end
     // operator last 7 days start
    function operator_plaza_7(){
//         SELECT * FROM plaza_report where plaza_code = 20
// order by id desc limit 8;
        $data = json_decode(file_get_contents('php://input'),true);
        $plaza = $data['plaza'];
        $this->db->select('*');
        $this->db->from('plaza_report');
        $this->db->where('plaza_code', $plaza);
        $this->db->order_by('date_rep', 'desc');
        $this->db->limit(7);

        $query = $this->db->get();
        $result = $query->result();
        $returnArr = array("data"=>$result,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Data Fetched successfully!");
        echo json_encode($returnArr);

    }

     // operator last 7 days end
     function insertreport() {
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
            echo json_encode($returnArr);
            return;
        }
        $data8 = json_decode(file_get_contents('php://input'),true);

        $plaza_code = $data8['plaza_code'];
        $date = $data8['date_rep'];
        // echo json_encode($date);
        // return;
        $prev_date = date('Y-m-d', strtotime($date . ' -1 day'));
        // echo json_encode($prev_date);
        // return;
        $prev_que = array('plaza_code' => $plaza_code , 'date_rep' => $prev_date);
   
       $this->db->select('diff_cash_tp');
       $query1 = $this->db->get_where('plaza_report' , $prev_que);
       if ($query1->num_rows() <= 0 ) {
           $open_amt = $data8['opening_amt'];
           // test
           $diff_cash_tp = floatval($open_amt) + floatval($data8['diff_cash_tp']) - floatval($data8['salary']);
           $insert = array(
            'date_rep' => $data8['date_rep'],
            'opening_amt' => $open_amt,
            'adv_from_ho' => $data8['adv_from_ho'],
            'total_cash_recievable' => $data8['total_cash_recievable'],
            'balaji' => $data8['balaji'],
            'monthly_pass_amt' => $data8['monthly_pass_amt'],
            'gross_cash_rec' => $data8['gross_cash_rec'],
            'total_cash' => $data8['total_cash'],
            'total_cash_rec' => $data8['total_cash_rec'],
            'short_excess_tc' => $data8['short_excess_tc'],
            'cash_dep_bank' => $data8['cash_dep_bank'],
            'cash_dep_arcpl' => $data8['cash_dep_arcpl'],
            'cash_kpt' => $data8['cash_kpt'],
            'diff_cash_tp' => $diff_cash_tp,
            'total_fast_tag_cl' => $data8['total_fast_tag_cl'],
            'short_amt_adj' => $data8['short_amt_adj'],
            'excess_amt_adj' => $data8['excess_amt_adj'],
            'total_fast_tag_rec' => $data8['total_fast_tag_rec'],
            'fst_tg_trf_bnk' => $data8['fst_tg_trf_bnk'],
            'diff_reciev' => $data8['diff_reciev'],
            'total_coll' => $data8['total_coll'],
            'plaza_code' => $data8['plaza_code'],
            'user_id' => $data8['user_id'],
            'salary' => $data8['salary']
        );

        $search = array(
            'date_rep'=>$data8['date_rep'],
            'plaza_code' => $data8['plaza_code']
        );
        $this->db->select('date_rep,plaza_code');
        $query = $this->db->get_where('plaza_report' , $search);
        if ($query->num_rows() > 0) {
            $responses = array("ResponseCode" => "402", "Result" => "false", "ResponseMsg" => "Entry done for today");
            echo json_encode($responses);
            return;
        }else{

        try {

        $this->db->insert('plaza_report', $insert);

        // Check if the insertion was successful
        if ($this->db->affected_rows() > 0) {
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
            $insert = array(
                'action' => 'Plaza Entry',
                'user_id' => $data8['user_id'],
                'toll_id'=>$data8['plaza_code'],
                "ip_address" => $this->input->ip_address()
            );
            $this->db->insert('log_maintain', $insert);
        } else {
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        }
       } 
       catch(Exception $err){
        // echo json_encode($response);
        $response1 = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        echo json_encode($response1);
       }
       echo json_encode($response);
    }
           // test
       }else{
        // try{
            // echo print_r($query1->num_rows());
           $cdata = $query1->row();
        //    if($cdata->diff_cash_tp){
           $open_amt = $cdata->diff_cash_tp;
        //    }else{
        //     $open_amt = 0;
        //    }
        // }catch(Exception $e){
            // $open_amt = 0;
        // }
        //    $debugData = array(
        //     "plaza_code" => $plaza_code,
        //     "prev_date" => $prev_date,
        //     "diff_cash_tp" => $open_amt
        // );
        // $diff_cash_tp = floatval($open_amt) + floatval($data8['diff_cash_tp']);
        $diff_cash_tp = floatval($data8['diff_cash_tp']) + floatval($open_amt) ;
        // $response1 = array("opening amount" => $open_amt, "diff_cash_tp" => $diff_cash_tp, "ResponseMsg" => "Failed to insert data!");
        // echo json_encode($response1);
        // return;
        
        // $responses = array("ResponseCode" => "200", "Result" => "true", "OpenAmount" => $open_amt, "DebugData" => $debugData);
        // echo json_encode($responses);
        // return;
           

    // select diff_cash_tp from plaza_report where
    //  plaza_code = 1 and 
    //  date_rep = CURDATE() - INTERVAL 1 DAY;

        $insert = array(
            'date_rep' => $data8['date_rep'],
            'opening_amt' => $open_amt,
            'adv_from_ho' => $data8['adv_from_ho'],
            'total_cash_recievable' => $data8['total_cash_recievable'],
            'balaji' => $data8['balaji'],
            'monthly_pass_amt' => $data8['monthly_pass_amt'],
            'gross_cash_rec' => $data8['gross_cash_rec'],
            'total_cash' => $data8['total_cash'],
            'total_cash_rec' => $data8['total_cash_rec'],
            'short_excess_tc' => $data8['short_excess_tc'],
            'cash_dep_bank' => $data8['cash_dep_bank'],
            'cash_dep_arcpl' => $data8['cash_dep_arcpl'],
            'cash_kpt' => $data8['cash_kpt'],
            'diff_cash_tp' => $diff_cash_tp,
            'total_fast_tag_cl' => $data8['total_fast_tag_cl'],
            'short_amt_adj' => $data8['short_amt_adj'],
            'excess_amt_adj' => $data8['excess_amt_adj'],
            'total_fast_tag_rec' => $data8['total_fast_tag_rec'],
            'fst_tg_trf_bnk' => $data8['fst_tg_trf_bnk'],
            'diff_reciev' => $data8['diff_reciev'],
            'total_coll' => $data8['total_coll'],
            'plaza_code' => $data8['plaza_code'],
            'user_id' => $data8['user_id']
        );

        $search = array(
            'date_rep'=>$data8['date_rep'],
            'plaza_code' => $data8['plaza_code']
        );
        $this->db->select('date_rep,plaza_code');
        $query = $this->db->get_where('plaza_report' , $search);
        if ($query->num_rows() > 0) {
            $responses = array("ResponseCode" => "402", "Result" => "false", "ResponseMsg" => "Entry done for today");
            echo json_encode($responses);
            return;
        }else{

        try {

        $this->db->insert('plaza_report', $insert);

        // Check if the insertion was successful
        if ($this->db->affected_rows() > 0) {
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
            $insert = array(
                'action' => 'Plaza Entry',
                'user_id' => $data8['user_id'],
                'toll_id'=>$data8['plaza_code'],
                "ip_address" => $this->input->ip_address()
            );
            $this->db->insert('log_maintain', $insert);
        } else {
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        }
       } 
       catch(Exception $err){
        // echo json_encode($response);
        $response1 = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        echo json_encode($response1);
       }
       echo json_encode($response);
    }

    }

    
    }

    // plaza insert report start
    function insertplazareport(){
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
            echo json_encode($returnArr);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'),true);
        $plaza_code = $data['plaza_code'];
        $date = $data['date_rep'];

        // if(!isset($data['initial_opn'])){
        //     $query = "SELECT opn_amt FROM `plaza_master` WHERE plaza_id=$plaza_code";
        //     $result = $this->db->query($query)->result();
            
        // }
        
        if(isset($data['plaza_code']) && $data['plaza_code'] !=null ){
        // $plaza_code = $data['plaza'];
        $query = "SELECT opn_amt FROM `plaza_master` WHERE plaza_id=$plaza_code";
            $result = $this->db->query($query)->result_array();
            // echo json_encode($result[0]['opn_amt']);
            $initial_opn_fetch = $result[0]['opn_amt'];
            $insert = array(
            'date_rep' => $data['date_rep'],
            'opening_amt' => $data['opening_amt'],
            'adv_from_ho' => $data['adv_from_ho'],
            'total_cash_recievable' => $data['total_cash_recievable'],
            'balaji' => $data['balaji'],
            'monthly_pass_amt' => $data['monthly_pass_amt'],
            'gross_cash_rec' => $data['gross_cash_rec'],
            'total_cash' => $data['total_cash'],
            'total_cash_rec' => $data['total_cash_rec'],
            'short_excess_tc' => $data['short_excess_tc'],
            'cash_dep_bank' => $data['cash_dep_bank'],
            'cash_dep_arcpl' => $data['cash_dep_arcpl'],
            'cash_kpt' => $data['cash_kpt'],
            'diff_cash_tp' => $data['diff_cash_tp'],
            'total_fast_tag_cl' => $data['total_fast_tag_cl'],
            'short_amt_adj' => $data['short_amt_adj'],
            'excess_amt_adj' => $data['excess_amt_adj'],
            'total_fast_tag_rec' => $data['total_fast_tag_rec'],
            'fst_tg_trf_bnk' => $data['fst_tg_trf_bnk'],
            'diff_reciev' => $data['diff_reciev'],
            'total_coll' => $data['total_coll'],
            'plaza_code' => $data['plaza_code'],
            'user_id' => $data['user_id'],
            'salary' => $data['salary'],
            'remittance' => $data['remitance'],
            'on_monthly_pass_amt' => $data['on_monthly_pass_amt'],
            'initial_opn' => $initial_opn_fetch
        );

        $search = array(
            'date_rep'=>$data['date_rep'],
            'plaza_code' => $data['plaza_code']
        );

        $this->db->select('date_rep,plaza_code');
        $query = $this->db->get_where('plaza_report' , $search);
        if ($query->num_rows() > 0) {
            $responses = array("ResponseCode" => "402", "Result" => "false", "ResponseMsg" => "Entry done for today");
            echo json_encode($responses);
            return;
        }else{
            try {

                $this->db->insert('plaza_report', $insert);
        
                // Check if the insertion was successful
                if ($this->db->affected_rows() > 0) {

                    $report_id = $this->db->insert_id();
                    $date = $data['date_rep'];
                   if(!empty($data['expensetype'])){
                    foreach ($data['expensetype'] as $expense) {
                        $insert_plaza_report_detail = array(
                            'date_rep' => $date,
                            'report_id' => $report_id,
                            'exp_id' => $expense['id'],
                            'amount' => $expense['amount'],
                            'voucher_no' => $expense['voucherno'],
                            'narration' => $expense['narration'],
                            'is_active'=>'1',
                            'plaza_code'=>$data['plaza_code']
                        );

                        $this->db->insert('plaza_report_detail',$insert_plaza_report_detail);
                    }
                }
                    $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
                    $insert = array(
                        'action' => 'Plaza Entry',
                        'user_id' => $data['user_id'],
                        'toll_id'=>$data['plaza_code'],
                        "ip_address" => $this->input->ip_address()
                    );
                    $this->db->insert('log_maintain', $insert);
                    echo json_encode($response);
                    exit;
                } else {
                    $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
                }
               } 
               catch(Exception $err){
                $response1 = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
                echo json_encode($response1);
               }
        }
        }else{
            $response = array("Responsecode"=>401,"Msg"=>"initial_opening not found");
            echo json_encode($response);
        }
        
    }
    // plaza insert report end
    // insert expense head start
    function insertexp(){
        $data = json_decode(file_get_contents('php://input'),true);

        $inserarr = array(
            'name' => $data['name'],
            'created_by' => $data['uid'],
            'is_active' => 1,
            'show_in'=>$data['show_exp'],
            'ip_address' => $this->input->ip_address()
        );
        $this->db->insert('expense_master',$inserarr);
        if ($this->db->affected_rows() > 0) {
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Expense Added successfully!");
            echo json_encode($response);
            exit;
        }else{
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Error Occurred");
            echo json_encode($response);
            exit;
        }

    }
    // insert expense head end
    function trydemo(){
        $data = json_decode(file_get_contents('php://input'),true);
        if(isset($data['plaza'])&& $data['plaza'] !=null ){
        $plaza_code = $data['plaza'];
        $query = "SELECT opn_amt FROM `plaza_master` WHERE plaza_id=$plaza_code";
            $result = $this->db->query($query)->result_array();
            echo json_encode($result[0]['opn_amt']);
        }else{
            $response = array("Responsecode"=>401,"Msg"=>"initial_opening not found");
            echo json_encode($response);
        }
    }
    // update expense head starts
    function updexpense(){
        $data = json_decode(file_get_contents('php://input'),true);
        $updarr = array(
            'name' => $data['name'],
            'show_in'=>$data['show_exp']
        );
        $this->db->where('id', $data['expid']); 
        $this->db->update('expense_master', $updarr);
        if ($this->db->affected_rows() > 0) {
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Expense Added successfully!");
            echo json_encode($response);
            exit;
        }else{
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Error Occurred");
            echo json_encode($response);
            exit;
        }
    }
    // update expense head ends
    // update plaza report start
    function updateplazareport() {
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
            echo json_encode($returnArr);
            return;
        }
        $data8 = json_decode(file_get_contents('php://input'),true);
        $entry_id = $data8['id'];
        $open_amt = $data8['opening_amt'];
        
        $diff_cash_tp = floatval($open_amt) + floatval($data8['diff_cash_tp']) - floatval($data8['salary']);

        $update_entry = array(
            'date_rep' => $data8['date_rep'],
            'opening_amt' => $open_amt,
            'adv_from_ho' => $data8['adv_from_ho'],
            'total_cash_recievable' => $data8['total_cash_recievable'],
            'balaji' => $data8['balaji'],
            'monthly_pass_amt' => $data8['monthly_pass_amt'],
            'gross_cash_rec' => $data8['gross_cash_rec'],
            'total_cash' => $data8['total_cash'],
            'total_cash_rec' => $data8['total_cash_rec'],
            'short_excess_tc' => $data8['short_excess_tc'],
            'cash_dep_bank' => $data8['cash_dep_bank'],
            'cash_dep_arcpl' => $data8['cash_dep_arcpl'],
            'cash_kpt' => $data8['cash_kpt'],
            'diff_cash_tp' => $diff_cash_tp,
            'total_fast_tag_cl' => $data8['total_fast_tag_cl'],
            'short_amt_adj' => $data8['short_amt_adj'],
            'excess_amt_adj' => $data8['excess_amt_adj'],
            'total_fast_tag_rec' => $data8['total_fast_tag_rec'],
            'fst_tg_trf_bnk' => $data8['fst_tg_trf_bnk'],
            'diff_reciev' => $data8['diff_reciev'],
            'total_coll' => $data8['total_coll'],
            'plaza_code' => $data8['plaza_code'],
            'user_id' => $data8['user_id'],
            'modified_by' => $data8['user_id'],
            'ip_address' => $this->input->ip_address()
        );
        $this->db->where('id', $entry_id);
        $this->db->update('plaza_report', $update_entry);
        
        if ($this->db->affected_rows() > 0) {
            $insert = array(
                'action' => 'Plaza Entry Updated',
                'user_id' => $data8['user_id'],
                'toll_id'=>$data8['plaza_code'],
                "ip_address" => $this->input->ip_address()
            );
            $this->db->insert('log_maintain', $insert);
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
        } else {
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        }
        echo json_encode($response);
        return;
    }
    // update plaza report end
    // update plaza report new start
    
    function updpreporttest() {
        //  $this->db->select('diff_cash_tp');
        //     $this->db->from('plaza_report');
        //   $this->db->where('id', $entry_id);
        //     $query = $this->db->get();
            
            $sql="Select  * from  plaza_report  where plaza_code=18 and  date_rep>'2024-02-10' order by date_rep limit 1 ";    
         $query = $this->db->query($sql);
$oldCash_TP=0;
            if ($query->num_rows() > 0) {
                
                 foreach($query->result_array() as $row)
            {
                $oldCash_TP=$row['opening_amt'];
            }
            }
              if($oldCash_TP<0)
            {
                 $oldCash_TP= -1*$oldCash_TP+326736;
                
            }
            else{
                 $oldCash_TP= $oldCash_TP-326736;
            
                
            }
            
             $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => $oldCash_TP);
        echo json_encode($response);
    }
    
    
    function updpreport() {
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $returnArr = array("ResponseCode" => "405", "Result" => "false", "ResponseMsg" => "Method Not Allowed");
            echo json_encode($returnArr);
            return;
        }
        $data8 = json_decode(file_get_contents('php://input'),true);
        $entry_id = $data8['id'];
        
        $open_amt = $data8['opening_amt'];
        
        $diff_cash_tp = floatval($open_amt) + floatval($data8['diff_cash_tp']) - floatval($data8['salary']);

             $oldCash_TP=0;

   
         $sql="Select  * from  plaza_report  where plaza_code=".$data8['plaza_code']." and  date_rep='".$data8['date_rep']."' order by date_rep limit 1 ";    
         $query = $this->db->query($sql);
            if ($query->num_rows() > 0) {
                
                 foreach($query->result_array() as $row)
            {
                $oldCash_TP=$row['diff_cash_tp'];
            }
                
            
                
            }
            
            $oldCash_TP=floatval($data8['diff_cash_tp'])-$oldCash_TP;
            
          //  if($oldCash_TP<0)
          //  {
           //      $oldCash_TP= -1*$oldCash_TP+floatval($data8['diff_cash_tp']);
                
           // }
           // else{
                
            //     $oldCash_TP= $oldCash_TP-floatval($data8['diff_cash_tp']);
            
                
          //  }
            
            
        //     $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Select  * from  plaza_report  where plaza_code=". $data8['plaza_code']." and  date_rep>'".$data8['date_rep']."' order by date_rep limit 1 ");
        // echo json_encode($response);
        
            
        //  exit;



        $update_entry = array(
            'date_rep' => $data8['date_rep'],
            'opening_amt' => $open_amt,
            'adv_from_ho' => $data8['adv_from_ho'],
            'total_cash_recievable' => $data8['total_cash_recievable'],
            'balaji' => $data8['balaji'],
            'monthly_pass_amt' => $data8['monthly_pass_amt'],
            'gross_cash_rec' => $data8['gross_cash_rec'],
            'total_cash' => $data8['total_cash'],
            'total_cash_rec' => $data8['total_cash_rec'],
            'short_excess_tc' => $data8['short_excess_tc'],
            'cash_dep_bank' => $data8['cash_dep_bank'],
            'cash_dep_arcpl' => $data8['cash_dep_arcpl'],
            'cash_kpt' => $data8['cash_kpt'],
            'diff_cash_tp' => $data8['diff_cash_tp'],
            'total_fast_tag_cl' => $data8['total_fast_tag_cl'],
            'short_amt_adj' => $data8['short_amt_adj'],
            'excess_amt_adj' => $data8['excess_amt_adj'],
            'total_fast_tag_rec' => $data8['total_fast_tag_rec'],
            'fst_tg_trf_bnk' => $data8['fst_tg_trf_bnk'],
            'diff_reciev' => $data8['diff_reciev'],
            'total_coll' => $data8['total_coll'],
            'plaza_code' => $data8['plaza_code'],
            'user_id' => $data8['user_id'],
            'modified_by' => $data8['user_id'],
            'ip_address' => $this->input->ip_address(),
            'on_monthly_pass_amt' => $data8['on_monthly_pass_amt']
        );
        $this->db->where('id', $entry_id);
        $this->db->update('plaza_report', $update_entry);
        
        //$this->db->query("update plaza_report set opening_amt=opening_amt+". $oldCash_TP.", diff_cash_tp=diff_cash_tp+". $oldCash_TP." where plaza_code=".$data8['plaza_code']." and  date_rep>'".$data8['date_rep']."'")
        //
        
         $sql="update plaza_report set opening_amt=opening_amt+". $oldCash_TP.", diff_cash_tp=diff_cash_tp+". $oldCash_TP." where plaza_code=".$data8['plaza_code']." and  date_rep>'".$data8['date_rep']."'";    
         $query = $this->db->query($sql);
        
        // if(empty($data['expensetype'])){
        //         $insert_detail = array(
        //             'is_active' => 0
        //         );
        //         $this->db->where('report_id',$entry_id);
        //         $this->db->update('plaza_report_detail',$insert_detail);
            
        //     $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
        //     echo json_encode($response);
        //     return;
        // }
        
        // testttt
        // if($data8['expensetype']){
            if (!empty($data8['expensetype'])) {
                $update_expense = array(
                    'is_active' =>0
                );
                $this->db->where('report_id',$entry_id);
                $this->db->update('plaza_report_detail',$update_expense);
        foreach ($data8['expensetype'] as $expense) {
            $insert_plaza_report_detail = array(
                'date_rep' => $data8['date_rep'],
                'report_id' => $entry_id,
                'exp_id' => $expense['id'],
                'amount' => $expense['amount'],
                'voucher_no' => $expense['voucherno'],
                'narration' => $expense['narration'],
                'is_active'=>'1',
                'plaza_code'=>$data8['plaza_code']
            );

            $this->db->insert('plaza_report_detail',$insert_plaza_report_detail);
        }
    }else{
        
        $insert_detail = array(
            'is_active' => 0
        );
        $this->db->where('report_id',$entry_id);
        $this->db->update('plaza_report_detail',$insert_detail);
    
    }
        // testttt
        // if ($this->db->affected_rows() > 0) {
        //     $insert = array(
        //         'action' => 'Plaza Entry Updated',
        //         'user_id' => $data8['user_id'],
        //         'toll_id'=>$data8['plaza_code'],
        //         "ip_address" => $this->input->ip_address()
        //     );
        //     $this->db->insert('log_maintain', $insert);
        //     $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!");
        // } else {
        //     $response = array("ResponseCode" => "403", "Result" => "false", "ResponseMsg" => "Failed to insert data!");
        // }
        $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Data inserted successfully!","rep"=>$oldCash_TP);
        echo json_encode($response);
        return;
    }
    // update palza report new end
    // opening report start
    function all_plaza_opening(){
        $data = json_decode(file_get_contents('php://input'),true);
        $date = $data['date'];
        // $prev_date = date('Y-m-d', strtotime($date . ' -1 day'));
        // $query = "SELECT plaza_master.plaza_id, plaza_master.name, IFNULL(SUM(plaza_report.initial_opn + plaza_report.diff_cash_tp), 0) as oa
        // FROM plaza_master
        // LEFT JOIN plaza_report ON plaza_master.plaza_id = plaza_report.plaza_code AND plaza_report.date_rep = '$date'
        // GROUP BY plaza_master.plaza_id;";
        $query = "SELECT
    plaza_master.plaza_id,
    plaza_master.name,
    COALESCE(SUM(pr.initial_opn + pr.diff_cash_tp),
        COALESCE((SELECT (COALESCE(pr2.initial_opn, 0) + COALESCE(pr2.diff_cash_tp, 0)) AS last_row_sum
                  FROM plaza_report AS pr2
                  WHERE pr2.plaza_code = plaza_master.plaza_id AND pr2.date_rep<'$date'
                  ORDER BY pr2.date_rep DESC LIMIT 1), 0)) AS oa
FROM
    plaza_master
LEFT JOIN
    plaza_report AS pr ON plaza_master.plaza_id = pr.plaza_code AND pr.date_rep = '$date'
WHERE plaza_master.is_active = 1
GROUP BY
    plaza_master.plaza_id;";

    // $result = $this->
    $result = $this->db->query($query)->result_array();
    echo json_encode($result);  
    return;
    }
    // opening report end
    // get oa start
    function getoa(){
        $data = json_decode(file_get_contents('php://input'),true);
        
        $plaza_code = $data['plaza'];
        $date = $data['date'];
        $plazares = array('plaza_code' => $plaza_code);
        $this->db->select('*');
        $plazaavail = $this->db->get_where('plaza_report',$plazares);
        $pdata = $plazaavail->row();
        if ($pdata == null) {
            $getplazaoa = array('plaza_id' => $plaza_code);
            $this->db->select('opn_amt as oa,opn_amt as oi,name');
            $oafrommaster = $this->db->get_where('plaza_master', $getplazaoa);
            $oafetch = $oafrommaster->row();
            $oafetch->io = 0;
            echo json_encode($oafetch);
            exit;
        }
        // echo json_encode($pdata);
        // exit;
        $prev_date = date('Y-m-d', strtotime($date . ' -1 day'));
        $prev_que = array('plaza_code' => $plaza_code , 'date_rep' => $prev_date);
        // +initial_opn
       $this->db->select('IFNULL(SUM(diff_cash_tp),0) AS oa,IFNULL(SUM(plaza_report.initial_opn+plaza_report.diff_cash_tp),0) as oi,plaza_master.opn_amt as io ,plaza_master.name as name,plaza_master.remitance');
       $this->db->join('plaza_master', 'plaza_master.plaza_id=plaza_report.plaza_code');
//    IFNULL(diff_cash_tp,0)
//     SELECT * FROM plaza_report where plaza_code = 4
// order by date_rep DESC limit 1 ;
// SELECT plaza_report.diff_cash_tp,plaza_report.date_rep FROM plaza_report
// join plaza_master on plaza_master.plaza_id = plaza_report.plaza_code
// where plaza_report.plaza_code = 4
// order by date_rep DESC limit 1;
       $query1 = $this->db->get_where('plaza_report' , $prev_que);
       $cdata = $query1->row();
       echo json_encode($cdata);
       exit;

    }
    //get oa end
    // get remitance start
//     function getrem(){
//         $data = json_decode(file_get_contents('php://input'),true);
//         $id = $data['plaza_code'];
//         $query = "SELECT valid_from,
//         valid_to,
//         exp_id,
//         CASE
//             WHEN valid_from = CURDATE()  THEN (remitance * 2) / 3
//             WHEN valid_to = CURDATE()  THEN remitance / 3
//             WHEN valid_to < CURDATE() THEN 0
//             ELSE remitance
//         END AS remitance
//  FROM plaza_master
//  WHERE plaza_id = $id;";

//         $result = $this->db->query($query)->result_array();
//         echo json_encode($result[0]);
//         exit;
//     }

function getrem(){
    $data = json_decode(file_get_contents('php://input'),true);
    $id = $data['plaza_code'];
    $query = "SELECT valid_from,
    valid_to,
    exp_id,
    CASE
        WHEN valid_from = CURDATE()  THEN (remitance * 2) / 3
        WHEN valid_to = CURDATE()  THEN remitance / 3
        WHEN valid_to < CURDATE() THEN 0
        ELSE remitance
    END AS remitance
FROM plaza_master
WHERE plaza_id = $id;";

    $result = $this->db->query($query)->result_array();
    echo json_encode($result[0]);
    exit;
}
    // get remitance end
    
    function consolidated_report(){

        $data = json_decode(file_get_contents('php://input'),true);
        $from = $data['from'];
        $to = $data['to'];
//         $query = "SELECT date_rep,
//         SUM(total_cash_recievable) AS cash_1,
//          SUM(balaji) AS cash_2,
//          SUM(monthly_pass_amt) AS monthly_pass_amount,
//          SUM(gross_cash_rec) AS gross_cash_rec,
//          SUM(total_fast_tag_cl) AS total_fast_tag_cl,
//          SUM(cash_kpt) AS expense_from_tp,
//          SUM(gross_cash_rec + total_fast_tag_cl) AS total_coll,
//          SUM(remittance) AS agreed_remittance,
//          (SELECT IFNULL(SUM(amount),0) FROM ho_expense WHERE plaza_report.id = ho_expense.report_id AND ho_expense.exp_id NOT IN (15,16) AND  date_rep BETWEEN '$from' AND '$to') AS total_expense_from_ho,
//          (SUM(gross_cash_rec + total_fast_tag_cl) + SUM(cash_kpt) - SUM(remittance)) AS margin_without_expense
//   FROM plaza_report
//   WHERE date_rep BETWEEN '$from' AND '$to'
//   GROUP BY date_rep;";

$query = "SELECT
date_rep,
SUM(total_cash_recievable) AS cash_1,
SUM(balaji) AS cash_2,
SUM(monthly_pass_amt) AS monthly_pass_amount,
SUM(gross_cash_rec) AS gross_cash_rec,
SUM(total_fast_tag_cl) AS total_fast_tag_cl,
SUM(cash_kpt) AS expense_from_tp,
SUM(gross_cash_rec + total_fast_tag_cl) AS total_coll,
SUM(remittance) AS agreed_remittance,
(
    SELECT IFNULL(SUM(amount), 0) 
    FROM ho_expense 
    WHERE plaza_report.date_rep = ho_expense.date_rep
) AS total_expense_from_ho,
(
    SUM(gross_cash_rec + total_fast_tag_cl) 
    + SUM(cash_kpt) 
    - SUM(remittance)
) AS margin_without_expense
FROM 
plaza_report
WHERE date_rep BETWEEN '$from' AND '$to'
GROUP BY
date_rep;";

    // $result = $this->
    $result = $this->db->query($query)->result_array();
    //echo $query;
    // $reponse = array
    // $response = array("ResponseCode" => "200", "Result" => "true", "data" => "$result");
     echo json_encode($result);     
    }
    
    // get tcs start
    function gettcs(){
        $query = "SELECT * FROM tcstab where id = 1;";
        $result = $this->db->query($query)->result_array();
        echo json_encode($result);  
        exit;
    }
    // get tcs end
    // weekly remittance report start
    function weekly_report(){

        $data = json_decode(file_get_contents('php://input'),true);
        $from = $data['from'];
        $to = $data['to'];
        $query = "SELECT pr.plaza_code,
        pm.name,
        pr.date_rep,
        SUM(pr.total_cash_recievable) AS cash_1,
        SUM(pr.balaji) AS cash_2,
        SUM(pr.monthly_pass_amt) AS monthly_pass_amount,
        SUM(pr.gross_cash_rec) AS gross_cash_rec,
        SUM(pr.total_fast_tag_cl) AS total_fast_tag_cl,
        SUM(pr.cash_kpt) AS expense_from_tp,
        SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) AS total_coll,
        SUM(pr.remittance) AS agreed_remittance,
        (SELECT IFNULL(SUM(amount),0) FROM ho_expense WHERE pr.id = ho_expense.report_id  AND  date_rep BETWEEN '$from' AND '$to') AS total_expense_from_ho,
        (SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) + SUM(pr.cash_kpt) - SUM(pr.remittance)) AS margin_without_expense
 FROM plaza_report pr
 JOIN plaza_master pm ON pr.plaza_code = pm.plaza_id
 WHERE pr.date_rep BETWEEN '$from' AND '$to'
 GROUP BY pr.plaza_code, pr.date_rep;";

    // $result = $this->
    $result = $this->db->query($query)->result_array();
    //echo $query;
    // $reponse = array
    // $response = array("ResponseCode" => "200", "Result" => "true", "data" => "$result");
     echo json_encode($result);     
    }
    // weekly remittance report end
    
    
    // delete plaza start
    function delplaza(){
        $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['plaza_id'];
    
    $update_data = array(
        'is_active' => 0
    );

    $this->db->where('plaza_id', $id);
    $this->db->update('plaza_master', $update_data);

    // $insert = array(
    //     'action' => 'Plaza Entry',
    //     'user_id' => $data8['user_id'],
    //     'toll_id'=>$data8['plaza_code'],
    //     "ip_address" => $this->input->ip_address()
    // );
    // $this->db->insert('log_maintain', $insert);

    return $this->db->affected_rows();
    }
    // delete plaza end
    // update plaza start
    function updplaza(){
        $data = json_decode(file_get_contents('php://input'),true);
        $id = $data['plaza_id'];
        $data4['name'] = $data['name'];
        $data4['addr'] = $data['addr'];
        $data4['remitance'] = $data['remi'];
        $data4['opn_amt'] = $data['opn'];
        $data4['valid_from'] = $data['valid_from'];
        $data4['valid_to'] = $data['valid_to'];
        $data4['modified_by'] = $data['uid'];
        $data4['ip_address'] = $this->input->ip_address();

        if($this->db->where('plaza_id', $id)){
                $this->db->update('plaza_master', $data4);
                $responses = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Plaza Updated");
                
                
                $insertplazaarray = array(
                    'initial_opn'=>$data['opn']
                );
                $this->db->where('plaza_code', $id);
                $this->db->update('plaza_report',$insertplazaarray);
                $insert = array(
                    'action' => 'Plaza Updated',
                    'user_id' => $data['uid'],
                    'toll_id'=>$data['plaza_id'],
                    "ip_address" => $this->input->ip_address()
                );
                $this->db->insert('log_maintain', $insert);
                echo json_encode($responses);
                exit;
            }
    }
    // update plaza end
    // add plaza start
    function addplaza(){
        
        $data5 = json_decode(file_get_contents('php://input'),true);
        $insert = array(
            'name' => $data5['name'],
            'addr' => $data5['addr'],
            'remitance'=>$data5['remi'],
            'opn_amt' =>  $data5['opn'],
            'is_active' => 1,
            'valid_from' =>$data5['valid_from'],
            'valid_to' =>$data5['valid_to'],
            'user_id' => $data5['uid'],
            'modified_by' => $data5['uid'],
            "ip_address" => $this->input->ip_address(),
            "exp_id"=>1
        );
        $this->db->insert('plaza_master', $insert);
        if ($this->db->affected_rows() > 0) {
            $response = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "Plaza inserted successfully!");
            $credential	=	array('users.id' => $data5['uid']);
            $this->db->select('users.id,name, email, mobile, users.is_active as status, role_master.roll_name as role, temporary_token as token, plaza_assign as pid, role_id as rid');
            $this->db->from('users');
            $this->db->join('role_master', 'users.role_id = role_master.roll_code');
            $this->db->where($credential);
            $query = $this->db->get();
                $c = $query->row();
                
            // $insert = array(
            //     'action' => 'Plaza Added',
            //     'user_id' => $data5['uid'],
            //     'toll_id'=>$c->pid,
            //     "ip_address" => $this->input->ip_address()
            // );
            // $this->db->insert('log_maintain', $insert);
        } else {
            $response = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "Failed to insert plaza!");
        }
        echo json_encode($response);
        exit;

    }
    // add plaza end
    // remitance report start
    function generate_remireport(){
        $data = json_decode(file_get_contents('php://input'),true);
        $date = $data['from'];
        // $query = "SELECT
        // plaza_master.plaza_id,
        // plaza_master.name,
        // COALESCE(plaza_report.total_coll, 0) AS total_coll,
        // plaza_master.remitance,
        // plaza_report.date_rep
        // FROM plaza_master
        // LEFT JOIN plaza_report ON plaza_master.plaza_id = plaza_report.plaza_code AND plaza_report.date_rep = '$date'
        // ORDER BY plaza_master.plaza_id;";
        $query = "SELECT
        plaza_master.plaza_id,
        plaza_master.name,
        COALESCE(plaza_report.total_coll, 0) AS total_coll,
        plaza_master.remitance,
        COALESCE(plaza_report.date_rep,'$date') AS date_rep
        FROM plaza_master
        LEFT JOIN plaza_report ON plaza_master.plaza_id = plaza_report.plaza_code AND plaza_report.date_rep = '$date'
        WHERE plaza_master.is_active = 1
        ORDER BY plaza_master.plaza_id;";

        $result = $this->db->query($query)->result();
        $responses = array("ResponseCode" => "200", "Result" => "true", "Data" => $result);
        $this->output->set_content_type('application/json')->set_output(json_encode($responses));
    }
    // remitance report end 
    // from -to remi report start
    function fremi(){
//         Select date_rep,PM.name,sum(PR.total_coll) as total_collection,DATEDIFF ('2024-01-10','2024-01-01')*remitance as dated
// from plaza_report PR inner join plaza_master PM
// on PR.plaza_code=PM.plaza_id
// where pr.date_rep between '2024-01-01' and '2024-01-10'
// group by date_rep,PM.name
// order by date_rep,PM.name
        $data = json_decode(file_get_contents('php://input'),true);
        $from = $data['from'];
        $to = $data['to'];
    
    if($data['plaza_code'] == null ){
        // && $data['to'] ==
    //     $query = "Select PM.plaza_id,date_rep,PM.name,sum(PR.total_coll) as total_coll,DATEDIFF ('$to','$from')*remitance as remitance
    // from plaza_report PR inner join plaza_master PM
    // on PR.plaza_code=PM.plaza_id
    // where pr.date_rep between '$from' and '$to'
    // group by date_rep,PM.name
    // order by PM.plaza_id;";
    // echo "hi";
    // exit;
    // $query = "SELECT
    //     plaza_master.plaza_id,
    //     plaza_master.name,
    //     COALESCE(plaza_report.total_coll, 0) AS total_coll,
    //     plaza_master.remitance,
    //     COALESCE(plaza_report.date_rep,'$from') AS date_rep
    //     FROM plaza_master
    //     LEFT JOIN plaza_report ON plaza_master.plaza_id = plaza_report.plaza_code AND plaza_report.date_rep = '$from'
    //     WHERE plaza_master.is_active = 1
    //     ORDER BY plaza_master.plaza_id;";

    //     $result = $this->db->query($query)->result();
    //     $responses = array("ResponseCode" => "200", "Result" => "true", "Data" => $result);
    //     // $this->output->set_content_type('application/json')->set_output(json_encode($responses));
    //     echo json_encode($responses);
    //     exit;
    // $query = "Select PM.plaza_id,date_rep,PM.name,sum(PR.total_coll) as total_coll,DATEDIFF ('$to','$from')*remitance as remitance
    // from plaza_report PR inner join plaza_master PM
    // on PR.plaza_code=PM.plaza_id
    // where PR.date_rep between '$from' and '$to' 
    // group by date_rep,PM.name
    // order by PM.plaza_id;";
    // $query = "Select PM.plaza_id,date_rep,PM.name,sum(PR.total_coll) as total_coll,sum(PR.remittance) as remitance
    // from plaza_report PR inner join plaza_master PM
    // on PR.plaza_code=PM.plaza_id
    // where PR.date_rep between '$from' and '$to' 
    // group by date_rep,PM.name
    // order by PM.plaza_id;";
    
    $query = " SELECT PM.plaza_id, date_rep, PM.name, IFNULL(SUM(PR.total_coll+PR.on_monthly_pass_amt),0) AS total_coll, IFNULL(SUM(PR.remittance),PM.remitance) AS remittance,PM.exp_id
 FROM plaza_master PM
 LEFT JOIN plaza_report PR ON PM.plaza_id = PR.plaza_code AND PR.date_rep BETWEEN '$from' AND '$to'
 WHERE PM.is_active = 1 AND  ( '$from' between PM.valid_from and PM.valid_to  or '$from' between  PM.valid_from and PM.valid_to)
 GROUP BY PM.plaza_id, date_rep
 ORDER BY PM.plaza_id;";

        $result = $this->db->query($query)->result();
        $responses = array("ResponseCode" => "201", "Result" => "true", "Data" => $result);
        // $this->output->set_content_type('application/json')->set_output(json_encode($responses));
        echo json_encode($responses);
        exit;
    }else{
    //     if($data['to'] == date("Y-m-d")){
    //         $plaza = $data['plaza_code'];
    // $query = "Select PM.plaza_id,date_rep,PM.name,sum(PR.total_coll) as total_coll,DATEDIFF ('$to','$from')*remitance as remitance
    // from plaza_report PR inner join plaza_master PM
    // on PR.plaza_code=PM.plaza_id
    // where pr.date_rep between '$from' and '$to' 
    // group by date_rep,PM.name
    // order by PM.plaza_id;";

    //     $result = $this->db->query($query)->result();
    //     $responses = array("ResponseCode" => "201", "Result" => "true", "Data" => $result);
    //     $this->output->set_content_type('application/json')->set_output(json_encode($responses));
    //     exit;
    //     }
    $plaza = $data['plaza_code'];
    $query = "Select PM.plaza_id,date_rep,PM.name,sum(PR.total_coll) as total_coll,sum(PR.remittance) as remittance
    from plaza_report PR inner join plaza_master PM
    on PR.plaza_code=PM.plaza_id
    where PR.date_rep between '$from' and '$to' AND PM.plaza_id = '$plaza'
    group by date_rep,PM.name
    order by PM.plaza_id;";

        $result = $this->db->query($query)->result();
        $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
        $this->output->set_content_type('application/json')->set_output(json_encode($responses));
    }
}
    // from -to remi report end 

    function getreportid() {
        $data = json_decode(file_get_contents('php://input'),true);
        $plaza = $data['plaza'];
        $dateid = $data['date'];
        $query = "SELECT pr.id, pm.name
                  FROM plaza_report pr
                  JOIN plaza_master pm ON pr.plaza_code = pm.plaza_id
                  WHERE pr.plaza_code = $plaza AND pr.date_rep = '$dateid';";
    
        $result = $this->db->query($query)->result();
    
        // Check if there are rows returned
        if (!empty($result)) {
            // If there are rows, send the normal response
            $responses = array("ResponseCode" => "202", "Result" => "true", "Data" => $result);
            echo json_encode($responses);
        } else {
            // If there are no rows, send an alternative response
            $alternativeResponse = array("ResponseCode" => "404", "Result" => "false", "Message" => "No data found");
            echo json_encode($alternativeResponse);
        }
    }
    function testtt(){
        $data3 = json_decode(file_get_contents('php://input'),true);;
        $plaza_code = $data3['plaza_code'];
        $prev_date = $data3['date'];
        $prev_que = array('plaza_code' => $plaza_code , 'date_rep' => $prev_date);
   
       $this->db->select('diff_cash_tp as oa');
       $query1 = $this->db->get_where('plaza_report' , $prev_que);
       if ($query1->num_rows() < 0) {
           $open_amt = 0;
           $responses = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => "test1");
           echo json_encode($responses);
       }else{
           $cdata = $query1->row();
           // if($cdata){
           // $responses = array("ResponseCode" => "401", "Result" => "false", "ResponseMsg" => $cdata);
           echo json_encode($cdata);
           // }
       }
    }
// expense heads start
// function expe
// expense heads end
    

 function get_plaza() {
        // $query = $this->db->select('name, plaza_id')
        //                   ->get('plaza_master');
        
        // $result = $query->result(); 
        $query = $this->db->select('name, plaza_id')
                  ->where('is_active', 1) 
                  ->order_by('name','asc')
                  ->get('plaza_master');
    $result = $query->result(); 
        echo json_encode($result);
    }
    // GET USER API
    function manage_user($param1 = '', $param2 = ''){
        
            /* start menu active/inactive section*/
            // $this->session->unset_userdata('active_menu');
            // $this->session->set_userdata('active_menu', '11');
            /* end menu active/inactive section*/ 

            /* add new access */   
            // $data1 = json_decode(file_get_contents('php://input'), true);
            $data1 = json_decode(file_get_contents('php://input'),true);
        if ($param1 == 'add') {
            if (isset($data1['name'])) {
                $data['name'] = $data1['name'];
            }else{
                echo json_encode(array("status"=>"401","msg"=>$data1));
                exit;
            }
            // 'OR'=>array('mobile' => $data1['mobile'],'email' => $data1['email'])
            // 'email'=>$data1['email'],
            $search = array(
                'email'=>$data1['email'],
                'mobile' =>$data1['mobile']
            );
            // $this->db->select('mobile');
            // $this->db->or_where('email',$search['email']);
            // $this->db->or_where('mobile', $search['mobile']);
            // $query1 = $this->db->get_where('users' , $search)->result_array();
            $this->db->select('mobile');
            $this->db->where('email', $search['email']);
            $this->db->or_where('mobile', $search['mobile']);
            $query1 = $this->db->get('users')->result_array();

            if (count($query1) > 0) {
                $responses = array("ResponseCode" => "402", "Result" => "false", "ResponseMsg" => "Duplicate Number or Email");
                echo json_encode($responses);
                exit;
            }
            // $thsi->db->

            $data2['name']           = $data1["name"];
            $data2['password']       = md5($data1['password']);
            $data2['email']          = $data1['email'];
            $data2['mobile']          = $data1['mobile'];
            $data2['role_id']           = $data1['role'];    
            $data2['plaza_assign']    = $data1['pid']; 
            $data2['created_by']    = $data1['uid']; 
            $data2['ip_address'] = $this->input->ip_address();
            // $this->db->insert('users', $data);
            if($this->db->insert('users', $data2)){
            $credential	=	array('users.id' => $data1['uid']);
            $this->db->select('users.id,name, email, mobile, users.is_active as status, role_master.roll_name as role, temporary_token as token, plaza_assign as pid, role_id as rid');
            $this->db->from('users');
            $this->db->join('role_master', 'users.role_id = role_master.roll_code');
            $this->db->where($credential);
            $query = $this->db->get();
                $c = $query->row();
                
            // $insert = array(
            //     'action' => 'user Added',
            //     'user_id' => $data1['uid'],
            //     'toll_id'=>$c->pid,
            //     "ip_address" => $this->input->ip_address()
            // );
            // $this->db->insert('log_maintain', $insert);
                echo json_encode(array("ResponseCode"=>"200","msg"=>"success"));
                exit;
            }else{
                echo json_encode(array("ResponseCode"=>"401","msg"=>"fail"));
                exit;
            }
            // $this->session->set_flashdata('success', 'User added succeeded');
            // $this->Email_model->account_opening_email($data);
            // redirect(base_url() . 'index.php?admin/manage_user/', 'refresh');
        }
            /* edit access */ 
        if ($param1 == 'update') {
            // $data1 = json_decode(file_get_contents('php://input'),true);
            $data4['name']           = $data1['name'];
            $data4['password']       = md5($data1['password']);
            $data4['email']          = $data1['email'];
            $data4['mobile']          = $data1['mobile'];
            $data4['role_id']           = $data1['role'];    
            $data4['plaza_assign']    = $data1['pid'];   
            $data4['is_active'] = $data1['active'];
            //$data['username']       = $this->input->post('username');
            // if($this->input->post('password')!='' || $this->input->post('password')!=NULL){
            //     $data['password']   = md5($this->input->post('password'));
            // }
            
            // $data['email']          = $this->input->post('email');
            // $data['user_mobile_no']          = $this->input->post('mobile_no');
           
            $uids = $data1['getid'];

            
            // $this->db->update('users', $data4);
            // $this->session->set_flashdata('success', 'User update successed.');
            if($this->db->where('id', $uids)){
                $this->db->update('users', $data4);
                $responses = array("ResponseCode" => "200", "Result" => "true", "ResponseMsg" => "User Updated");
                echo json_encode($responses);
                exit;
            }
                $responses2 = array("ResponseCode" => "402", "Result" => "false", "ResponseMsg" => "Update Failed");
                echo json_encode($responses2);
                exit;
            // redirect(base_url() . 'index.php?admin/manage_user/', 'refresh');
        }

            /* delete access */        

        if ($param1 == 'delete') {
            $this->db->where('user_id', $param2);
            $this->db->delete('user');
            $this->db->where('ref_user_id', $param2);
            $this->db->delete('vendor_prof');
        }
        
            $data['page_name']      = 'user_manage';
            $data['page_title']     = 'User Management';
            // $this->db->select('id,name,role_id');
            $this->db->select('users.id, users.name, users.role_id,role_master.roll_name,users.is_active,plaza_master.name as plaza,users.plaza_assign as plaza_id,users.email as email,users.mobile as mobile'); // Add more columns as needed
            // $this->db->join('users', 'user.role_id = vendor_prof.ref_user_id');
            $this->db->join('role_master', 'users.role_id = role_master.id','left');
            $this->db->join('plaza_master', 'users.plaza_assign = plaza_master.plaza_id','left');
            $data['users']    = $this->db->order_by('type asc, id asc')->get_where('users')->result_array(); 
            $returnArr = array("data"=>$data['users'],"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Fetched!");
            echo json_encode($returnArr);   
        //    $this->load->view('admin/index', $data);

    }

    function get_role(){
       $this->db->select('id,roll_name');
       $data['roll'] = $this->db->get_where('role_master')->result_array();
       $returnArr = array("data"=>$data['roll'],"ResponseCode"=>"200");
       echo json_encode($returnArr);
    }

    // function get_plaza(){
    //     $this->db->select('id,roll_name');
    //     $data['roll'] = $this->db->get_where('role_master')->result_array();
    //     $returnArr = array("data"=>$data['roll'],"ResponseCode"=>"200");
    //     echo json_encode($returnArr);
    //  }

   // check all the data starts
   function checkstats(){
//     SELECT users.*,plaza_master.is_active FROM users
// INNER JOIN plaza_master
// ON users.plaza_assign = plaza_master.plaza_id
// AND users.id = 17;

            $data = json_decode(file_get_contents('php://input'),true);
            $credential	=	array('id' => $data['id']);
            $this->db->select('users.id,users.name, users.email, users.mobile, users.is_active as status,  users.temporary_token as token, users.plaza_assign as pid, users.role_id as rid,plaza_master.is_active');
            $this->db->from('users');
            $this->db->join('plaza_master', 'users.plaza_assign = plaza_master.plaza_id');
            $this->db->where($credential);

            $query = $this->db->get();
            if ($query->num_rows() > 0) {
                $c = $query->row();
                if($c->status=='1'){
                    $returnArr = array("user"=>$c,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Continue!");
                    echo json_encode($returnArr);
                    exit;
                }
                else {                
                    $returnArr = array("ResponseCode"=>"403","Result"=>"false","ResponseMsg"=>"Provoke!!!");
                    echo json_encode($returnArr);
                    exit;
                }
            }
            else
            {
                $returnArr = array("ResponseCode"=>"403","Result"=>"false","ResponseMsg"=>"Plaza provoked!!!");
                echo json_encode($returnArr);
                exit;
            }

            
   }
   // check all the data ends
// decryption and encrptio n starts
// function dummy(){
//     // Decode Base64 encoded data
//     $data = json_encode(file_get_contents('php://input'),true);
//     $data1 = json_decode($data);
//     // $data2 = json_decode($data1,true);
//     $decodedData = base64_decode($data1);
    
  
    
//     // Echo the decrypted data
//     echo $decodedData;
//     exit;
// }

function dummy(){
   
    $data = json_decode(file_get_contents('php://input'), true);
    $decodedData = base64_decode($data['data']);
    
  
    if(is_object($decodedData)) {
        $decodedData = json_encode($decodedData);
    }
    
    
    $trimmedData = trim($decodedData);

$var1 = json_decode($trimmedData,true);
echo $trimmedData;
$decry = openssl_decrypt($var1["data"],'AES256',$var1["key"],OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING);

echo print_r(json_decode($decry),true);
    $result = json_decode($decry);
    // echo print_r($result);
   
    exit;
    
}


// monthwise consolidated report start
function all_month_wise(){
    $year=date('Y');
$numbery=date('y');
$prevyear=$numbery-1;
$prevyearformat=$year-1;
$syear='';
$syearformat='';
for($k = 1; $k < 13; $k++){
$month=date('m', strtotime("+$k month")); 
$gety= date('y', strtotime("+$k month")); 
if($gety==$numbery){
    $syear= $prevyear;
    $syearformat= $prevyearformat;
    }
else{
     $syear=$numbery;
     $syearformat= $year;
    }

    
    

    $query = "SELECT
    YEAR(date_rep) AS year,
    MONTH(date_rep) AS month,
    COUNT(DISTINCT plaza_code) AS tp,
    SUM(total_cash_recievable) AS cash_1,
    SUM(balaji) AS cash_2,
    SUM(monthly_pass_amt) AS monthly_pass_amount,
    SUM(gross_cash_rec) AS gross_cash_rec,
    SUM(total_fast_tag_cl) AS total_fast_tag_cl,
    SUM(cash_kpt) AS expense_from_tp,
    SUM(gross_cash_rec + total_fast_tag_cl) AS total_coll,
    SUM(remittance) AS agreed_remittance,
    (
        SELECT IFNULL(SUM(amount), 0) 
        FROM ho_expense 
        WHERE MONTH(date_rep) = '$month'
        AND YEAR(date_rep) = YEAR(plaza_report.date_rep)
    ) AS total_expense_from_ho,
    (
        SUM(gross_cash_rec + total_fast_tag_cl) 
        + SUM(cash_kpt)
        - SUM(remittance)
    ) AS margin_without_expense
FROM
    plaza_report
WHERE 
    MONTH(date_rep) = '$month'
    AND YEAR(date_rep) = '$syearformat'
GROUP BY
    YEAR(date_rep), MONTH(date_rep);";

    // $result = $this->db->query($query)->result();
    $result = $this->db->query($query)->result_array();
    if(!empty($result)){
    
    foreach ($result as $row) { 
       
            $fdata[] = array(
        "cash_1" => $row['cash_1'],
        "cash_2" => $row['cash_2'], 
        "month" => $month,
        "year" => $syearformat,
        'total_coll' =>$row['total_coll'],
        'fst_tg_col' => $row['total_fast_tag_cl'],
        'exp_from_tp'=>$row['expense_from_tp'],
        'total_expense_from_ho'=>$row['total_expense_from_ho'],
        'toll_in_opr' =>$row['tp'],
        'agreed_remittance'=>$row['agreed_remittance']
    );
        
      
    }
    
    }
    
    
    

}


// $returnArr = array("ResponseCode" => "200", "Result" => $fdata);
// echo json_encode($returnArr);

echo json_encode($fdata);

return;
}
// monthwise consolidated report end
function hoexpense_report(){
    
    // $data = json_decode(file_get_contents('php://input'), true);

    $query = "SELECT date_rep,plaza_master.name AS plaza,expense_master.name,ho_expense.amount,ho_expense.narration
    FROM ho_expense
    LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
    LEFT JOIN expense_master ON expense_master.id = ho_expense.exp_id
    ORDER BY date_rep desc limit 10;";
    $result = $this->db->query($query)->result_array();
    echo json_encode($result);

    // SELECT date_rep,plaza_master.name,expense_master.name,ho_expense.amount 
    // from ho_expense
    // left join plaza_master on plaza_master.plaza_id = plaza_code
    // left join expense_master on expense_master.id = ho_expense.exp_id;

//     SELECT date_rep,
//        plaza_code,
//        plaza_master.name,
//        SUM(amount) AS total_amount
// FROM ho_expense
// LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
// WHERE ho_expense.exp_id NOT IN (15, 16)
// GROUP BY date_rep, plaza_code, plaza_master.name
// ORDER BY date_rep, plaza_code;

        // SELECT date_rep,plaza_master.name,expense_master.name,ho_expense.amount
        // FROM ho_expense
        // LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
        // LEFT JOIN expense_master ON expense_master.id = ho_expense.exp_id
        // WHERE ho_expense.exp_id NOT IN(15,16) AND ho_expense.date_rep BETWEEN '2024-03-01' AND '2024-03-31'
        // ORDER BY date_rep desc limit 10;


        // SELECT date_rep,plaza_master.name,expense_master.name,ho_expense.amount
        // FROM ho_expense
        // LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
        // LEFT JOIN expense_master ON expense_master.id = ho_expense.exp_id
        // WHERE ho_expense.exp_id NOT IN(15,16) AND ho_expense.date_rep BETWEEN '2024-03-01' AND '2024-03-31' AND ho_expense.plaza_code = 16
        // ORDER BY date_rep desc limit 10;




}
// expense report start 
function hoexpense_detail(){
    $data = json_decode(file_get_contents('php://input'), true);
    $from = $data['from'];
    $to = $data['to'];
    
    if($data['plaza_code'] == null ){
        $query = "SELECT date_rep,plaza_master.name AS plaza,expense_master.name,ho_expense.amount,ho_expense.narration
        FROM ho_expense
        LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
        LEFT JOIN expense_master ON expense_master.id = ho_expense.exp_id
        WHERE ho_expense.date_rep BETWEEN '$from' AND '$to'
        ORDER BY date_rep desc;";
    $result = $this->db->query($query)->result_array();
    echo json_encode($result);
    exit;
    }else{
        $plaza = $data['plaza_code'];
        $query = " SELECT date_rep,plaza_master.name AS plaza,expense_master.name,ho_expense.amount,ho_expense.narration
        FROM ho_expense
        LEFT JOIN plaza_master ON plaza_master.plaza_id = plaza_code
        LEFT JOIN expense_master ON expense_master.id = ho_expense.exp_id
        WHERE ho_expense.date_rep BETWEEN '$from' AND '$to' AND ho_expense.plaza_code = $plaza
        ORDER BY date_rep desc;";
    $result = $this->db->query($query)->result_array();
    echo json_encode($result);
    }
}
// expense report end
// MONTH WISE ALL PLAZA COLLECTION START
function monthly_report_cons(){

$data = json_decode(file_get_contents('php://input'),true);
$month = $data['month'];
$year = $data['year'];
$query = "SELECT pr.plaza_code,
pm.name,
pr.date_rep,
SUM(pr.total_cash_recievable) AS cash_1,
SUM(pr.balaji) AS cash_2,
SUM(pr.monthly_pass_amt) AS monthly_pass_amount,
SUM(pr.gross_cash_rec) AS gross_cash_rec,
SUM(pr.total_fast_tag_cl) AS total_fast_tag_cl,
SUM(pr.cash_kpt) AS expense_from_tp,
SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) AS total_coll,
SUM(pr.remittance) AS agreed_remittance,
(SELECT IFNULL(SUM(amount),0) FROM ho_expense WHERE ho_expense.report_id = pr.id  AND MONTH(date_rep) = '$month'
    AND YEAR(date_rep) = '$year') AS total_expense_from_ho,
(SUM(pr.gross_cash_rec + pr.total_fast_tag_cl) + SUM(pr.cash_kpt) - SUM(pr.remittance)) AS margin_without_expense
FROM plaza_report pr
JOIN plaza_master pm ON pr.plaza_code = pm.plaza_id
WHERE
MONTH(date_rep) = '$month'
AND YEAR(date_rep) = '$year'
GROUP BY pr.plaza_code,pr.date_rep;";

// $result = $this->
$result = $this->db->query($query)->result_array();
//echo $query;
// $reponse = array
// $response = array("ResponseCode" => "200", "Result" => "true", "data" => "$result");
echo json_encode($result);     
}
// MONTH WISE ALL PLAZA COLLECTION END

 // Decode Base64 encoded data
      // If the decrypted data is an object, convert it to JSON string
    // Trim the output to remove any extra characters or whitespace
    //     $var1 = json_decode($trimmedData,true);
//     // echo print_r($var1);
//     // Echo the trimmed decrypted data
//     $decryptedData = openssl_decrypt(base64_decode($var1["data"]), 'aes-256-cbc', $var1["key"], OPENSSL_RAW_DATA);
//     $decryptedData = openssl_decrypt($var1["data"], 'aes-256-cbc', $var1["key"], OPENSSL_RAW_DATA);
//     // echo print_r($decryptedData,true);
//     $result = json_decode($decryptedData, true);

// // Output the decrypted data
//     var_dump($result);
    // echo $var1["key"];
// echo $var1["data"];
// echo $trimmedData;
    // echo $decry;
     // echo $result;

// decryption and encryprion ends
    function dashboard()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if($data['uid'] == '')
        {
         $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
        }
        else
        {
            $g=array();
            $credential	=	array(	'uid' => $data['uid'] );
            $this->db->select("count(*) as tcase,
            IFNULL(SUM(CASE WHEN status='review' THEN 1 ELSE 0 END),0) AS pending,
            IFNULL(SUM(CASE WHEN status='rejected' THEN 1  ELSE 0 END),0) AS rejected,
            IFNULL(SUM(CASE WHEN status='approved' THEN 1  ELSE 0 END),0) AS approved,
            IFNULL(sum(loan_amt) ,0) as tamt, 
            IFNULL(SUM(CASE WHEN status='review' THEN loan_amt ELSE 0 END),0) AS tpending,
            IFNULL(SUM(CASE WHEN status='rejected' THEN loan_amt ELSE 0 END),0) AS trejected,
            IFNULL(SUM(CASE WHEN status='approved' THEN loan_amt ELSE 0 END),0) AS tapproved");
            $query = $this->db->get_where('orders' , $credential);
        
              if($query->num_rows())
          {
        
          //  while($row = $query->fetch_assoc())
            foreach($query->result_array() as $row)
            {
                $p['tcase'] = $row['tcase'];
                $p['pending'] = $row['pending'];
                $p['rejected'] = $row['rejected'];
                $p['approved'] = $row['approved'];
                $p['tamt'] = $row['tamt'];
                $p['tpending'] = $row['tpending'];
                $p['trejected'] = $row['trejected'];
                $p['tapproved'] = $row['tapproved'];
                    $g[] = $p;
            }
            
            $returnArr = array("Data"=>$g,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Dashboard  Get Successfully!!!");
          }
        
        
        }
        
        echo json_encode($returnArr);

    }


    function getwallet()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if($data['uid'] == '')
        {
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
        }
        else
        {
           // $status = $con->query("select wallets from user where id=".$data['uid']." and status = 1");
            $credential	=	array(	'id' => $data['uid'] ,'status'=>'1');
            $this->db->select('wallet');
            $query = $this->db->get_where('users' , $credential);

            if ($query->num_rows() > 0) {
       
           
            foreach($query->result_array() as $row)
            {
                $amt=$row['wallet'];
            }
            
            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=> $amt);
        }else
        {
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"0");
        }
        
        }
        
        echo json_encode($returnArr);   
      
         

    }

    function wallethistory()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if($data['uid'] == '')
        {
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
        }
        else
        {
           
            //echo "select * from wallets where user_id=".$uid." order by id desc";
          //  $results = $con->query("select * from wallets where user_id=".$uid." order by id desc");

            $credential	=	array(	'user_id' => $data['uid'] );
           $this->db->order_by("created_at desc");
            $query = $this->db->get_where('wallets' , $credential);
            
            if ($query->num_rows() > 0) {
                
                    $p = array();
                    $q = array();
                    foreach($query->result_array() as $row)
                    {
                        
                        $p['amount'] = $row['amount'];
                        $p['method'] = $row['payment_method'];
                        $p['rdate']=$row['created_at'];
                    
                        $charge = $row['approval'];
                        if($charge==1){
                            $p['status']="Approved";
                        }else if($charge==2){
                            $p['status']="Rejected";
                        }else{
                            $p['status']="Pending";
                        }
                
            
                          $q[] = $p;
                      }
                
                
                $returnArr = array("ResponseCode"=>"201","Result"=>"true","ResponseMsg"=>"Data Found!","ResultData"=>$q);
            
        
            }else{
                
                $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"No Result Found!");
            }
            
            
        
            
        }
        echo json_encode($returnArr);
        }


        function aadhaarcheck()
        {

            $data = json_decode(file_get_contents('php://input'), true);
            $AadharNo='';
            if($data['uid'] != '')
                {
                    $AadharNo=$data['uid'];
      
                }
                $valid = $this->common_model->isAadharValid($AadharNo);
                $isValid = 'false';
                if ($valid == 0) {
                    $isValid = 'true';
                }
                
                 $returnArr = array("ResponseCode"=>"401","Result"=>$isValid,"ResponseMsg"=>$valid);
                
                //echo '<BR>'.$isValid;
                echo json_encode($returnArr);

        }

        function productall()
        {
            $data = json_decode(file_get_contents('php://input'), true);
                if($data['uid'] == '')
                {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
                }
                else
                {

               // $sel = $con->query("select * from products where uid=".$data['uid']);

                $credential	=	array(	'uid' => $data['uid'] );
                $query = $this->db->get_where('products' , $credential);

                if ($query->num_rows() > 0) {
                $myarray = array();
                foreach($query->result_array() as $row)
                {
                    $result['id'] = $row['id'];
                    $result['product_name'] = $row['pname'];
                    $result['product_image'] = $row['pimg'];
                    $result['product_related_image'] = $row['prel'];
                    $result['seller_name'] = $row['sname'];
                    $result['short_desc'] = $row['psdesc'];
                    $a = explode('$;',$row['pgms']);
                    //print_r($a[0]);
                    $ab = explode('$;',$row['pprice']);
                    $k=array();
                    for($i=0;$i<count($a);$i++)
                    {
                        $k[$i] = array("product_type"=>$a[$i],"product_price"=>$ab[$i]);
                    }
                    
                    $result['price'] = $k;
                    $result['stock'] = $row['stock'];
                    $result['discount'] = $row['discount'];
                    $myarray[] = $result;

                        //$myarray[] = $p;
                }
                $returnArr = array("data"=>$myarray,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Product List Get successfully!");
                }
                else{
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Product Not Found!"); 
                }
                }
                echo json_encode($returnArr);

        }


        function cat()
        {

            //$sel = $con->query("select * from categories");
            $this->db->select('*');
			$this->db->from('categories');
            $query = $this->db->get();
          
         //   $query = $this->db->where('categories');
            $myarray = array();
            if ($query->num_rows() > 0) {
            foreach($query->result_array() as $row)
            {
                $p['id'] = $row['id'];
                $p['catname'] = $row['catname'];
                    $p['catimg'] = $row['catimg'];
                    $p['count'] = count($this->db->get_where('sub_categories', array('cat_id' =>$row['id']))->result_array());
                    $myarray[] = $p;
            }
        }
            $returnArr = array("data"=>$myarray,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Category List Founded!");
            echo json_encode($returnArr);

        }

        function subcategory()
        {
            $data = json_decode(file_get_contents('php://input'), true);
            if($data['category_id'] == '')
            {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
            }
            else
            {
                //$cat_id = $data['category_id'];

                $credential	=	array(	'cat_id' => $data['category_id'] );
                $query = $this->db->get_where('sub_categories' , $credential);

                
            //$sel = $con->query("select * from subcategories where cat_id=".$cat_id."");
           
            if ($query->num_rows() > 0) {
                $myarray = array();
                foreach($query->result_array() as $row)
                  {
                    $p['id'] = $row['id'];
                    $p['cat_id'] = $row['cat_id'];
                    $p['name'] = $row['name'];
                    $p['img'] = $row['img'];
                    $p['count'] = count($this->db->get_where('products', array('sid' =>$row['id']))->result_array());
                    $myarray[] = $p;
                  }
            $returnArr = array("data"=>$myarray,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Subcategory List Founded!");
            }
            else 
            {
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"SubCategory Not Found!!!");	
            }
            }
            echo json_encode($returnArr);
        }

        function register_product()
        {

            $data = json_decode(file_get_contents('php://input'), true);
                if($data['p_name'] == ''  or $data['p_descp'] == '' or $data['p_price']==''  or $data['uid'] == '' or $data['cid'] == '' or $data['sid'] == '' or $data['p_img'] == '')
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                }
                else
                {
                    
                    $p_name = $data['p_name'];
                    $s_name = $p_name;
                    $p_descp = $data['p_descp'];
                    $p_price =$data['p_price'];
                    $uid = $data['uid'];
                    $cid = $data['cid'];
                    $sid = $data['sid'];
                    $p_img = $data['p_img'];
                    
                    $credential	=	array(	'pname' => $p_name,'uid'=>$uid );
                    $query = $this->db->get_where('products' , $credential);
                    
                    // $checkproduct = $con->query("select * from products where pname='".$p_name."' and uid=".$uid."");
                
                
                    if ($query->num_rows() > 0) {
                    
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Product Already Registered!");
                    }
                    else
                    {

                        $imgp=$this->common_model->storeimage_product($p_img,$uid);
                   
                        $timestamp = date("Y-m-d H:i:s");

                        $this->db->trans_start();
                        $datap['pname']       = $p_name;
                        $datap['sname']       = $s_name;
                        $datap['psdesc']      = $p_descp;
                        $datap['pprice']      = $p_price;
                        $datap['uid']         = $uid;
                        $datap['cid']         = $cid;
                        $datap['sid']         = $sid;
                        $datap['date']        = $timestamp;
                        $datap['pimg']        = $imgp;
                        $datap['pgms']        = '1 Nos.';
                        $datap['status']      = 1;
                        $datap['stock']       = 1;  
                        $this->db->insert('products', $datap);
                        if ($this->db->trans_status() === FALSE)
                        {
                                $this->db->trans_rollback();
                                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                        }
                        else
                        {
                                $this->db->trans_commit();
                                $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Product Added Success Fully!");
                        }
                                                
                    }
                          
                    
                }
                echo json_encode($returnArr);
        }

        function product()
        {
            
                $data = json_decode(file_get_contents('php://input'), true);

                if($data['cid'] != '' or $data['sid'] != '' or $data['uid'] != '')
                {
                    $uid = $data['uid'];
                    $cid = $data['cid'];
                    $sid = $data['sid'];

                    $credential	=	array(	'uid' => $data['uid'],'status'=> '1');
                    $query = $this->db->get_where('products' , $credential);
                    
                   // $counter = $con->query("select * from products where uid=".$uid." and status=1");
                   if ($query->num_rows() > 0) {
                   // $query = $con->query("select * from products where uid=".$uid." and status=1");
                    $result = array();
                    $pp=array();
                    
                    foreach($query->result_array() as $row)
                    {
                        
                    $result['id'] = $row['id'];
                    $result['product_name'] = $row['pname'];
                    $result['product_image'] = $row['pimg'];
                    $result['product_related_image'] = $row['prel'];
                    $result['seller_name'] = $row['sname'];
                    $result['short_desc'] = $row['psdesc'];
                    $a = explode('$;',$row['pgms']);
                    //print_r($a[0]);
                    $ab = explode('$;',$row['pprice']);
                    $k=array();
                    for($i=0;$i<count($a);$i++)
                    {
                        $k[$i] = array("product_type"=>$a[$i],"product_price"=>$ab[$i]);
                    }
                    
                    $result['price'] = $k;
                    $result['stock'] = $row['stock'];
                    $result['discount'] = $row['discount'];
                    $pp[] = $result;
                    }
                    $returnArr = array("data"=>$pp,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Product List Get successfully!");
                    }
                    else
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Product  Not Found!");
                    }
                      echo json_encode($returnArr);
                }
               else
                {
                    echo "dont touch";
                }
        }

        function timeslot()
        {
            $this->db->select('*');
			$this->db->from('timeslot');
             $query = $this->db->get();
            // $sel = $con->query("select * from timeslot");
                $p = array();
                foreach($query->result_array() as $row)
                {
                    $myarray['id'] = $row['id'];
                    $myarray['mintime'] = $row['mintime'];//date("g:i A", strtotime($row['mintime']));
                    $myarray['maxtime'] = $row['maxtime'];//date("g:i A", strtotime($row['maxtime']));
                    $p[] = $myarray;
                }
                $returnArr = array("data"=>$p,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Timeslot Founded!");
                echo json_encode($returnArr);
        }


        function paymentgateway()
        {
            $this->db->select('*');
			$this->db->from('payment_list');
             $query = $this->db->get();
            // $sel = $con->query("select * from timeslot");
            $myarray = array();
                foreach($query->result_array() as $row)
                {
                    $myarray[] = $row;
                }
                $returnArr = array("data"=>$myarray,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Payment Gateway List Founded!");
                echo json_encode($returnArr);
        }

        function getcity()
        {
            $data = json_decode(file_get_contents('php://input'), true);

                    if($data['pin'] == '' )
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                    }

                    else{
                            $district='';
                            $state='';
                            $YourUrl='https://api.postalpincode.in/pincode/'.$data['pin'];
                            $result = file_get_contents($YourUrl);
                            $array = json_decode($result, true);
                            $pp=$array[0];
                            $returnArr = array("ResponseCode"=>"401","Result"=>"false","d"=>$district,"s"=>$state,"ResponseMsg"=>"Wrong Pincode!");
                            if ($pp['Status']=='Success')
                            {
                                $pname = $pp['PostOffice'];
                                for($i=0;$i<count($pname);$i++)
                                    {
                                        $district=$pname[$i]['District'];
                                        $state=$pname[$i]['State'];
                                        break;
                                    }
                                $returnArr = array("ResponseCode"=>"200","Result"=>"true","d"=>$district,"s"=>$state,"ResponseMsg"=>"Got Successfully!!!");
                            }
                    }
                    echo json_encode($returnArr);

        }

        function sendsms()
        {
            $data = json_decode(file_get_contents('php://input'), true);

            if($data['phone'] == '' )
            {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
            }

            $mobileno='91'.$data['phone'];

            $six_digit_random_number = random_int(100000, 999999);

            $message = "Your Verification Code for LOANPY is ".$six_digit_random_number.".The OTP is valid for 1 Minute.";

            $message = urlencode($message);
            // CURLOPT_URL => 'http://smslogin.pcexpert.in/api/mt/SendSMS?user=loanpy&password=Admin@123&senderid=TAloan&channel=Trans&DCS=0&flashsms=0&number='.$mobileno.'&text='.$message.'&route=46&peid=1201162995920175418&dlttemplateid=1207163038912992742',
            $curl = curl_init();
            curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://www.businesssms.co.in/smsaspx?ID=ankit.supare100@gmail.com&Pwd=Anshul@123456&PhNo='.$mobileno.'&Text='.$message.'&TemplateID=1207163038912992742',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
        
            ));
            $response = curl_exec($curl);
            curl_close($curl);

            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"$six_digit_random_number","cresponse"=>$response);
            echo json_encode($returnArr);
        }

    function order()
        {
            $data = json_decode(file_get_contents('php://input'), true);
            if($data['uid'] == '')
            {
             $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
            }
            else
            {
                $productid=0;
                $amt=0;
                $filecharges=0;
                $pname = $data['pname'];
                
                for($i=0;$i<count($pname);$i++)
                {
                 $productid = $pname[$i]['pid'];
                }

                $credential	=	array(	'id' => $data['uid'],'status'=> '1');
                $query = $this->db->get_where('users' , $credential);
                                // $status = $con->query("select wallets from users where id=".$data['uid']." and status = 1");
                if ($query->num_rows() > 0) {
                     
                    foreach($query->result_array() as $row)
                        {
                            $amt=$row['wallet'];
                        }
                                   
                    }
                    
                    //$status = $con->query("select file_charges from products P inner join categories C on P.cid=C.id where P.id=".$productid."");
                
                    $this->db->select("file_charges");
                    $this->db->from('categories'); 
                    $this->db->join('products', 'categories.id =products.cid');
                    $this->db->where('products.id',$productid);
                    $query = $this->db->get();
                    // $credential	=	array(	'id' => $data['uid'],'status'=> '1');
                    // $query = $this->db->get_where('users' , $credential);

                
                    if ($query->num_rows() > 0) {
                       foreach($query->result_array() as $row)
                        {
                            $filecharges=$row['file_charges'];
                        }
                    }
                    
                    
                    if ($amt>=$filecharges){
                                                
                        $cust_id=0;
                        $aadhar_img='';
                        $aadhar_img_back='';
                        $pan_img='';
                        $electric_img='';
                        $bank_img='';
                        $selfie_img='';
                        $loan_case_no=strtoupper(uniqid());
                        $aadhar_no=$data['AADHAARNO'];
                    
            //Aadhar front
                $p_img = $data['AADHAAR'];
                   if ($p_img=="")
                        $aadhar_img='uploads/noimage.png';
                   else
                        $aadhar_img=$this->common_model->storeimage_order($p_img,$aadhar_no,'AF');
            
                //aadhaar back        
                $p_img = $data['AADHAARBACK'];
                   if ($p_img=="")
                       $aadhar_img_back='uploads/noimage.png';
                   else
                      $aadhar_img_back=$this->common_model->storeimage_order($p_img,$aadhar_no,'AB');
            
                 //Pancard     
                
                $p_img = $data['PAN'];
                   if ($p_img=="")
                        $pan_img='uploads/noimage.png';
                   else
                        $pan_img=$this->common_model->storeimage_order($p_img,$aadhar_no,'PN');
            
                 //Electric Bill     
                
                 $p_img = $data['ELECTRIC'];
                 if ($p_img=="")
                      $electric_img='uploads/noimage.png';
                 else
                      $electric_img=$this->common_model->storeimage_order($p_img,$aadhar_no,'EL');
             
            
             //Bank Bill     
                
             $p_img = $data['BANK'];
             if ($p_img=="")
                  $bank_img='uploads/noimage.png';
             else
                  $bank_img=$this->common_model->storeimage_order($p_img,$aadhar_no,'BK');
            
                   //selfie    
                
                $p_img = $data['SELFIE'];
                if ($p_img=="")
                     $selfie_img='uploads/noimage.png';
                else
                     $selfie_img=$this->common_model->storeimage_order($p_img,$aadhar_no,'SL');
            
            
                // get customer
            
                $credential	=	array(	'aadhaar_no' => $data['AADHAARNO']);
                $query = $this->db->get_where('customers' , $credential);

               // $counter = $con->query("select * from customers where aadhaar_no=". $data['AADHAARNO']."");
               if ($query->num_rows() > 0) {
                    //get custid
                    foreach($query->result_array() as $row)
                    {
                        $cust_id=$row['custid'];
                    }
                }else
                {

                       $this->db->trans_start();
                        $datap['fname']             = $data['FNAME'];
                        $datap['mname']             = $data['MNAME'];
                        $datap['lname']             = $data['LNAME'];
                        $datap['address']           = $data['ADDRESS'];
                        $datap['city']              = $data['CITY'];
                        $datap['aadhaar_no']        = $data['AADHAARNO'];
                        $datap['mobile_no']         = $data['MOBILENO'];
                        $datap['panno']             = $data['PANNO'];
                        $datap['aadhaar_img']       = $aadhar_img;
                        $datap['aadhaar_img_back']  = $aadhar_img_back;
                        $datap['pan_img']           = $pan_img;
                      
                        $this->db->insert('customers', $datap);
                        $cust_id = $this->db->insert_id();
                        if ($this->db->trans_status() === FALSE)
                        {
                                $this->db->trans_rollback();
                        }
                        else
                        {
                                $this->db->trans_commit();
                        }
                  
                }
            
            
               
            
            
            
            $uid =  $data['uid'];
            $ddate =date("Y-m-d");
            //$a = explode('/',$ddate);
            //$ddate = $a[2].'-'.$a[1].'-'.$a[0];
            $oid ='#'.$loan_case_no;
            
            $status = 'review'; 
            $p_method = $data['p_method'];
            $address_id = 0;
            $tax = $data['tax'];
            $coupon_id = $data['coupon_id'];
            $cou_amt = $data['cou_amt'];
            $timestamp = date("Y-m-d");
            $tid = $data['tid'];
            $total = number_format((float)$data['total'], 2, '.', '');
            $e= array();
            $p = array();
            $w=array();
            $pp = array();
            $q = array();
            for($i=0;$i<count($pname);$i++)
            {
            $e[] = $pname[$i]['title'];
            $p[] = $pname[$i]['pid'];
            $w[] = $pname[$i]['weight'];
            $pp[] = $pname[$i]['cost'];
            $q[] = $pname[$i]['qty'];
            }
            $pname = implode('$;',$e);
            $pid = implode('$;',$p);
            $ptype = implode('$;',$w);
            $pprice = implode('$;',$pp);
            $qty = implode('$;',$q);
            
            
            $loan_no= $loan_case_no;
            $loan_amt= $data['LTOTAL'];
            $dp_amt= $data['PDOWN'];
            $card_charges= $data['PCARD'];
            $process_charges= $data['PCHARGES'];
            $dbd_charges= $data['PDBD'];
            $roi= $data['ROI'];
            $tennure= $data['MONTHS'];
            $emi_amount=  $data['EMI'];
            $ref_no=$data['REFNO'];
            $total = number_format((float)$data['total'], 2, '.', '');
            
         
            $this->db->trans_start();
            $dataorders['oid']             = $oid;
            $dataorders['uid']             = $uid;
            $dataorders['custid']          = $cust_id;
            $dataorders['pname']           = $pname;
            $dataorders['pid']             = $pid;
            $dataorders['ptype']           = $ptype;
            $dataorders['pprice']          = $pprice;
            $dataorders['ddate']           = $ddate;
            $dataorders['order_date']      = $timestamp;
            $dataorders['status']          = $status;
            $dataorders['qty']             = $qty;
            $dataorders['total']           = $total;
            $dataorders['p_method']        = $p_method;
            $dataorders['address_id']      = $address_id;
            $dataorders['tax']             = $tax;
            $dataorders['tid']             = $tid;
            $dataorders['cou_amt']         = $cou_amt;
            $dataorders['coupon_id']       = $coupon_id;
            $dataorders['loan_no']         = $loan_no;
            $dataorders['loan_amt']        = $loan_amt;
            $dataorders['dp_amt']          = $dp_amt;
            $dataorders['card_charges']    = $card_charges;
            $dataorders['process_charges'] = $process_charges;
            $dataorders['dbd_charges']     = $dbd_charges;
            $dataorders['roi']             = $roi;
            $dataorders['tennure']         = $tennure;
            $dataorders['emi_amount']      = $emi_amount;
            $dataorders['ref_no']          = $ref_no;
            $dataorders['aadhaar_img']     = $aadhar_img;
            $dataorders['aadhaar_img_back']= $aadhar_img_back;
            $dataorders['pan_img']         = $pan_img;
            $dataorders['electric_img']    = $electric_img;
            $dataorders['bank_img']        = $bank_img;
            $dataorders['selfie_img']      = $selfie_img;
            $dataorders['file_charge']     = $filecharges;
           
            $this->db->insert('orders', $dataorders);
                    
            if ($this->db->trans_status() === FALSE)
            {
                    $this->db->trans_rollback();
            }
            else
            {
                    $this->db->trans_commit();
            }

            // $sql="insert into orders(`oid`,`uid`,`custid`,`pname`,`pid`,`ptype`,`pprice`,`ddate`,`order_date`,`status`,`qty`,`total`,`p_method`,`address_id`,`tax`,`tid`,`cou_amt`,`coupon_id`,`loan_no`,`loan_amt`,`dp_amt`,`card_charges`,`process_charges`,`dbd_charges`,`roi`,`tennure`,`emi_amount`,`ref_no`,`aadhaar_img`,`aadhaar_img_back`,`pan_img`,`electric_img`,`bank_img`,`selfie_img`,`file_charge`)values('".$oid."',".$uid.",".$cust_id.",'".$pname."','".$pid."','".$ptype."','".$pprice."','".$ddate."','".$timestamp."','".$status."','".$qty."',".$total.",'".$p_method."',".$address_id.",".$tax.",'".$tid."',".$cou_amt.",".$coupon_id.",'".$loan_no."',".$loan_amt.",".$dp_amt.",".$card_charges.",".$process_charges.",".$dbd_charges.",".$roi.",".$tennure.",".$emi_amount.",'".$ref_no."','".$aadhar_img."','".$aadhar_img_back."','".$pan_img."','".$electric_img."','".$bank_img."','".$selfie_img."',".$filecharges.")";
            // //echo $sql;
            // $con->query($sql);
            
            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Loan Request Placed Successfully!!!");
            
            
            $mobileno='91'.$data['MOBILENO'];
            
            $message = "Dear Customer, Your  Loan Application No. ".$loan_case_no.". has been Received and is Under Review -LOANPY";
            
            $message = urlencode($message);
            
            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL => 'http://smslogin.pcexpert.in/api/mt/SendSMS?user=loanpy&password=Admin@123&senderid=TAloan&channel=Trans&DCS=0&flashsms=0&number='.$mobileno.'&text='.$message.'&route=46&peid=1201162995920175418&dlttemplateid=1207163116542356912',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
            
             
            ));
            $response = curl_exec($curl);
            curl_close($curl);

            $this->db->trans_start();
            $datawallets['user_id']             = $uid;
            $datawallets['request_id']          = 0;
            $datawallets['payment_method']      = 'LoanCase';
            $datawallets['amount']              = -1*$filecharges;
            $datawallets['approval']            = 5;
                     
            $this->db->insert('wallets', $datawallets);
           
            if ($this->db->trans_status() === FALSE)
            {
                    $this->db->trans_rollback();
            }
            else
            {
                    $this->db->trans_commit();
            }
            

            $datausers['id']=$uid;
            $this->db->set('wallet', "wallet-$filecharges", false);
            $this->db->where('id', $uid);
            $this->db->update('users', $datausers);
            
            // $query="insert into wallets(`user_id`,`request_id`,`payment_method`,`amount`,`approval`)values(".$uid.",0,'LoanCase',".-1*$filecharges.",5)";
            //         $con->query( $query);
           // $con->query("update users set wallet=wallet-".$filecharges." where  id=".$uid."");
            
            }
            else{
                $returnArr = array("ResponseCode"=>"201","Result"=>"false","ResponseMsg"=>"Wallet Balance is Low Please Recharge!!!");
            }
            
            }
            
            
            echo json_encode($returnArr);


        }
        function history()
        {

            $data = json_decode(file_get_contents('php://input'), true);
            if($data['uid'] == '')
            {
             $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
            }
            else
            {
                $uid =  $data['uid'];

                $this->db->select("orders.*,DATE_FORMAT(order_date, '%d-%m-%Y') as oDate,CONCAT(fname , ' ' , mname , ' ' , lname) as custname,customers.mobile_no as mno");
                $this->db->from('orders'); 
                $this->db->join('customers', 'orders.custid =customers.custid');
                $this->db->where('orders.uid',$uid);
                $query = $this->db->get();

             // $sel = $con->query("select *,DATE_FORMAT(order_date, '%d-%m-%Y') as oDate from orders where uid=".$uid." order by id desc"); 
              
              
              
              $g=array();
              $po= array();
              if ($query->num_rows() > 0) {
                //get custid
                foreach($query->result_array() as $row)
              {
                  $g['id'] = $row['id'];
                  $g['oid'] = $row['loan_no'];
                  $oid = $row['oid'];
                  $g['status'] = $row['status'];
                  $g['order_date'] = $row['oDate'];
                  $g['total'] = $row['loan_amt'];
            
                
               // $rdata = $con->query("select * from customers where custid=".$row['custid']."")->fetch_assoc();
            
                  $g['customer_status'] = "Assigned";
                  $g['customer_name'] = strtoupper($row['custname']);
                  $g['customer_mobile'] = $row['mno'];
            
            
                $po[] = $g;
                  
              }
              $returnArr = array("Data"=>$po,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Order History  Get Successfully!!!");
              }
              else 
              {
                  $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Order  Not Found!!!");
              }
            }
            echo json_encode($returnArr);


        }

        function ocancle()
        {
            $data = json_decode(file_get_contents('php://input'), true);
                if($data['uid'] == '' or $data['oid'] == '')
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                }
                else
                {
                    $uid = $data['uid'];
                    $oid = $data['oid'];
                    
                    
                    $datausers['status']='cancelled';
                    $this->db->where('id', $oid);
                    $this->db->where('uid', $uid);
                    $this->db->update('orders', $datausers);

                    //$con->query("update orders set status='cancelled' where  id=".$oid." and uid=".$uid."");
                    
                    
                    $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Order Cancel Successfully!");
                    
                }
                echo json_encode($returnArr);

        }
        function oapprove()
        {
            $data = json_decode(file_get_contents('php://input'), true);
            if($data['uid'] == '' or $data['oid'] == '')
            {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
            }
            else
            {
                $uid = $data['uid'];
                $oid =$data['oid'];
               // $results = $con->query("update orders set status='approved' where  id=".$oid." and uid=".$uid."");
               
                $datausers['status']='approved';
                $this->db->where('id', $oid);
                $this->db->where('uid', $uid);
                $this->db->update('orders', $datausers);
                $affRows=$this->db->affected_rows();

                if($affRows >0 )
                {
                    
                     //$query = $con->query("select * from orders where id=".$oid."");
                     $credential	=	array('id' => $oid);
                     $query = $this->db->get_where('orders' , $credential);

                    
                     foreach($query->result_array() as $row)
                {
                    $cid=$row['custid'];
                    $mob=$this->common_model->get_cust_mobile($cid);
                    $loanbal=$row['loan_amt'];
                    $loanemi=$row['emi_amount'];
                    $loanno=$row['loan_no'];
                    $odate=$row['order_date'];
                    $todayStamp = strtotime($odate);
                    $numOfDays = date('d', $todayStamp);
                    $numOfmonth = date('m', $todayStamp);
                    $numOfyear = date('Y', $todayStamp);
                    if ($numOfDays>28)
                       $ndate=date($numOfyear.'-'.$numOfmonth.'-'.$numOfDays);
                    else
                        $ndate=$odate;
                        
                    for ($i = 0; $i < $row['tennure']; $i++){
                      $y=$i+1;
                      if ($y==$row['tennure'])
                        $loanbal=0;
                      else
                         $loanbal=$loanbal-$loanemi;
                      
                      $ndate = date('Y-m-d', strtotime("+1 months", strtotime($ndate)));
                      $dataemi=array();

                      $this->db->trans_start();
                      $dataemi['loan_id']       = $oid;
                      $dataemi['uid']           = $uid;
                      $dataemi['cid']           = $cid;
                      $dataemi['loan_no']       = $loanno;
                      $dataemi['emi_no']        = $y;
                      $dataemi['emi_amt']       = $loanemi;
                      $dataemi['emi_date']      = $ndate;
                      $dataemi['bal_emi']       = $loanbal;
                               
                      $this->db->insert('loan_emis', $dataemi);
                     
                      if ($this->db->trans_status() === FALSE)
                      {
                              $this->db->trans_rollback();
                      }
                      else
                      {
                              $this->db->trans_commit();
                      }


                    //   $sStr ="insert into loan_emis(`loan_id`,`uid`,`cid`,`loan_no`,`emi_no`,`emi_amt`,`emi_date`,`bal_emi`) values(".$oid.",".$uid.",".$cid.",'".$loanno."',".$y.",".$loanemi.",'".$ndate. "',".$loanbal .")";
                    //   $con->query($sStr);
                      
                    }
                    
                    $mobileno='91'.$mob;
            
            $message = "Dear Customer, Your  Loan Application No. ".$loanno.". is Approved -LOANPY";
            
            $message = urlencode($message);
            
            $curl = curl_init();
            curl_setopt_array($curl, array(
              CURLOPT_URL => 'http://smslogin.pcexpert.in/api/mt/SendSMS?user=loanpy&password=Admin@123&senderid=TAloan&channel=Trans&DCS=0&flashsms=0&number='.$mobileno.'&text='.$message.'&route=46&peid=1201162995920175418&dlttemplateid=1207163116553535052',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
            
             
            ));
            $response = curl_exec($curl);
            curl_close($curl);
                    
                    
                }
                    
                }
                
                
                $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Order Approved Successfully!");
                
            }
            echo json_encode($returnArr);

        }


        function plist()
        {
            $data = json_decode(file_get_contents('php://input'), true);
            if($data['uid'] == '')
            { 
            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
            }
            else
            {
                $id = $data['id'];
                $uid =$data['uid'];
            
           // $sel = $con->query("select * from orders where uid=".$uid." and id=".$id."");
              $credential	=	array('uid' => $uid,'id' => $id);
              $sel = $this->db->get_where('orders' , $credential);
            
            $result = array();
            $pp = array();
            foreach($sel->result_array() as $row)
                {
                $oid = $row['oid']; 
                $id = $row['id']; 
                $a = explode('$;',$row['pname']);    
                $b =  explode('$;',$row['pprice']);
                $c = explode('$;',$row['ptype']);
                $d = explode('$;',$row['qty']);
                $e = explode('$;',$row['pid']);
                $k=array();
                $subtotal = 0;
                $ksub = array();
                for($i=0;$i<count($a);$i++)
                {
                    
                    $credential	=	array('id' => $e[$i]);
                    $selproduct = $this->db->get_where('products' , $credential);
                    
                  //  $getimage = $con->query("select * from product where id=".$e[$i]."");
                   // $getimage = $getimage->fetch_assoc();
                   foreach($selproduct->result_array() as $getimage){
                    
                    $discount = $b[$i] * $getimage['discount']*$d[$i] /100;
                    $ksub [] = $subtotal  + ($d[$i] * $b[$i]) - $discount;
                    $k[$i] = array("product_name"=>$a[$i],"product_price"=>number_format((float)$b[$i], 2, '.', ''),"product_weight"=>$c[$i],"product_qty"=>$d[$i],"product_image"=>$getimage['pimg'],"discount"=>$getimage['discount']);
                   }
                }
                
                
                if($row['p_method'] == 'Pickup myself' and $row['status'] != 'completed' and $row['status'] != 'cancelled')
                {
                    $status = $row['p_method'];
                }
                else 
                {
                $status =$row['status'];
                }
                $p_method = $row['p_method'];
                $total =$row['total'] ;
                $odate = str_replace('--','',$row['ddate']);
                $timesloat = $row['timesloat'];
                $tax = $row['tax'];
                $counpon_discount = $row['cou_amt'];
                $address_id = $row['address_id'];
                $custid = $row['custid'];
                $loan_no= $row['loan_no'];
                $loan_amt=$row['loan_amt'];
                $dp_amt=$row['dp_amt'];
                $card_charges=$row['card_charges'];
                $process_charges=$row['process_charges'];
                $dbd_charges=$row['dbd_charges'];
                $roi=$row['roi'];
                $tennure=$row['tennure'];
                $emi_amount=$row['emi_amount'];
                $emi_start=$row['emi_start'];
                //$result['total'] = $row['total'];
                //$result['status'] = $row['status'];
                //$result['order_date'] = $row['order_date'];
                //$result['timesloat'] = $row['timesloat'];
                //$pp[] = $result;
                }
            
                // $orate = $con->query("select * from rate_order where oid='".$id."'");
                // if($orate->num_rows != 0)
                // {
                //     $rate = 'Yes';
                // }
                // else 
                // {
                    $rate = 'No'; 
                //}
                

                $credential	=	array('custid' => $custid);
                $selcust = $this->db->get_where('customers' , $credential);

                //$rider = $con->query("select * from customers where custid=".$custid."")->fetch_assoc();
                foreach($selcust->result_array() as $rider){
                $address_cust = $rider['address'].','.$rider['city'];
                $rider_mobile= $rider['mobile_no'];
                $cname=strtoupper($rider['fname']." ". $rider['mname']." ". $rider['lname']);
                }
                        
                        if($p_method == 'Pickup Myself')
                        {
                            $px = 0;
                        }
                        else 
                        {
                            $px = 0;
                        }
                $returnArr = array("productinfo"=>$k,"Sub_total"=>array_sum($ksub),"orderid"=>$id,"counpon_discount"=>$counpon_discount,"address"=>$address_cust,"address_type"=>'1',"customer_name"=>$cname,"total_amt"=>$total,"rider_mobile"=>$rider_mobile,"rider_name"=>$cname,"p_method"=>$p_method,"status"=>$status,"order_date"=>$odate,"timesloat"=>$timesloat,"Israted"=>$rate,"d_charge"=>$px,"tax"=>$tax,"loan_no"=>$loan_no,"loan_amt"=>$loan_amt,"dp_amt"=>$dp_amt,"card_charges"=>$card_charges,"process_charges"=>$process_charges,"dbd_charges"=>$dbd_charges,"roi"=>$roi,"tennure"=>$tennure,"emi_amount"=>$emi_amount,"emi_start"=>$emi_start,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Order Product Get successfully!");
            }
            echo json_encode($returnArr);

        }

        function abc()
        {
            $filecharges=100;
            $datausers['id']=4;
            $this->db->set('wallet', "wallet-$filecharges", false);
            $this->db->where('id', 4);
            $this->db->update('users', $datausers);
        }

        function emicollect(){
            $data = json_decode(file_get_contents('php://input'), true);

                    if($data['uid'] != '')
                    {
                        
                        $uid = $data['uid'];
                    
                        
                        // $counter = $con->query("select A.*,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emi A inner join customers B on A.cid=B.custid where uid=".$uid." and received=0 order by loan_id,emi_no");
                        // $sStr="(select 1 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emis A inner join customers B on A.cid=B.custid where uid=".$uid." and received=0  ) Union 
                        //        (select 2 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emi_penalties A inner join customers B on A.cid=B.custid where uid=".$uid." and received=0 ) order by emi_date,emi_no,loan_id,etype";
                        //echo $sStr;
                     //   $counter = $con->query($sStr);

                        $credential	=	array('uid' => $uid,'received'=>0);
                        $selcust = $this->db->get_where('emi_collect' , $credential);
                    
                        if ($selcust->num_rows() > 0) {
                                          
                        $pp=array();
                        $i=0;
                        foreach($selcust->result_array() as $rowemi)
                        {
                                    if ($rowemi['etype'])
                            $k[$i] = array("id"=>$rowemi['id'],"etype"=>$rowemi['etype'],"party_name"=>$rowemi['party_name'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No.'.$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']);
                                    else
                            $k[$i] = array("id"=>$rowemi['id'],"etype"=>$rowemi['etype'],"party_name"=>$rowemi['party_name'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'Late Charges EMI No.'.$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']);
                        $i=$i+1;
                        }
                    // $result['emi'] = $k;
                        $pp[] = $k;
                    
                        $returnArr = array("data"=>$k,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Party List Get successfully!");
                        }
                        else
                        {
                            $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Party Not Found!");
                        }
                    echo json_encode($returnArr);
                    }
                    else
                    {
                    echo "dont touch";
                    }
        }


        function sreceipt(){
            $data = json_decode(file_get_contents('php://input'), true);
            if($data['uid'] == '')
            {
             $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");    
            }
            else
            {
            
                $uid = $data['uid'];
                $emi_amt = $data['paid_amt'];
                $emi_id = $data['emi_id'];
            //    print_r($emi_id);
                for($i=0;$i<count($emi_id);$i++)
                    {
                    
                  
                    
                    $pid = $emi_id[$i]['id'];
                     $emitype = $emi_id[$i]['type'];
                    
                    //$pid = implode('$;',$p);
                    
                     $rDate=date('Y-m-d');
                     
                   if ($emitype ==1){
                  
                    // echo $str="update loan_emi set received=emi_amt,received_date='".$rDate."' where  id=".$pid."";
            
                     //$con->query("update loan_emis set received=emi_amt,received_date='".$rDate."' where  id=".$pid."");
                     
                     
                     $datausers['received_date']=$rDate;
                     $this->db->set('received', "emi_amt", false);
                     $this->db->where('id', $pid);
                     $this->db->update('loan_emis', $datausers);
                   
                    }
              else
                    {
                        // $con->query("update loan_emi_penalties set received=emi_amt,received_date='".$rDate."',is_waiver=0 where  id=".$pid."");
                         
                         $datausers['received_date']=$rDate;
                         $datausers['is_waiver']=0;
                         $this->db->set('received', "emi_amt", false);
                         $this->db->where('id', $pid);
                         $this->db->update('loan_emi_penalties', $datausers);


                         $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Penalty Posted Successfully!!!");
                    }
                  
                  
                    }
            
               
            
            
            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"EMI Recieved Successfully!!!");
            }
            
            echo json_encode($returnArr);

        }

        function party(){
            $data = json_decode(file_get_contents('php://input'), true);

                if($data['uid'] != '')
                {
                    
                    $cid = $data['uid'];
                    
                    
                   // $counter = $con->query("select A.id as lid,A.custid as id, CONCAT(fname,' ',mname,' ',lname) party_name,loan_amt balance from orders A inner join customers B on A.custid=B.custid  where uid=".$cid." and status='approved'");
                   

                    $this->db->select("A.id as lid,A.custid as id, CONCAT(fname,' ',mname,' ',lname) party_name,loan_amt balance");
                    $this->db->from('orders A'); 
                    $this->db->join('customers B', 'A.custid =B.custid');
                    $this->db->where('A.uid',$cid);
                    $this->db->where('A.status','approved');
                    $query = $this->db->get();
                   
                    if ($query->num_rows() > 0) {
                        //get custid
                       
                
                    $pp=array();
                    
                    foreach($query->result_array() as $row)
                    {
                        
                    $result['id'] = $row['id'];
                    $result['party_name'] = $row['party_name'];
                    $result['balance'] = $row['balance'];
                // $emi = $con->query("select * from loan_emi where loan_id=".$row['id']." and received=0 order by loan_id,emi_no LIMIT 2");
                
                    // $sStr="(select 1 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emis A inner join customers B on A.cid=B.custid where loan_id=".$row['lid']." and received=0) Union 
                    // (select 2 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emi_penalties A inner join customers B on A.cid=B.custid where loan_id=".$row['lid']." and received=0) order by loan_id,emi_no,etype Limit 2";
                    // $emi = $con->query($sStr);

                    $credential	=	array('loan_id' => $row['lid'],'received'=>0);
                    $this->db->limit(2);
                    $selcust = $this->db->get_where('emi_collect' , $credential);
                    
                    $k=array();
                    $i=0;
                    //while($rowemi = $emi->fetch_assoc())
                    foreach($selcust->result_array() as $rowemi)
                    {
                    
                    //  $k[$i] = array("id"=>$rowemi['id'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']);
                    //    $i=$i+1;
                    
                                if ($rowemi['etype'])
                        $k[$i] = array("id"=>$rowemi['id'],"etype"=>$rowemi['etype'],"party_name"=>$rowemi['party_name'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No.'.$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']);
                                else
                        $k[$i] = array("id"=>$rowemi['id'],"etype"=>$rowemi['etype'],"party_name"=>$rowemi['party_name'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'Late Charges EMI No.'.$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']);
                    $i=$i+1;
                    }
                    $result['emi'] = $k;
                    $pp[] = $result;
                    }
                    $returnArr = array("data"=>$pp,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Party List Get successfully!");
                    }
                    else
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Party Not Found!");
                    }
                echo json_encode($returnArr);
                }
                else
                {
                echo "dont touch";
                }
        }


        function partyledger(){
            $data = json_decode(file_get_contents('php://input'), true);

            if($data['uid'] != '' && $data['cid'] != '')
            {
                
                $uid = $data['uid'];
                $cid = $data['cid'];
                
                
                 //$counter = $con->query("select * from loan_emi where uid=".$uid." and cid=".$cid." order by loan_id,emi_no ");
                 
            //      $sStr="(select 1 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,A.received,A.received_date,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emis A inner join customers B on A.cid=B.custid where uid=".$uid." and cid=".$cid.") Union 
            //     (select 2 'etype',A.id,A.loan_id,A.loan_no,A.emi_no,A.emi_date,A.emi_amt,A.received,A.received_date,CONCAT(fname,' ',mname,' ',lname) as party_name from loan_emi_penalties A inner join customers B on A.cid=B.custid where uid=".$uid." and cid=".$cid.") order by loan_id,emi_no,etype";
            //    //echo $sStr;
            //     $counter = $con->query($sStr);
                 
                $credential	=	array('uid' => $uid,'cid'=>$cid);
                $selcust = $this->db->get_where('emi_collect' , $credential);
                 
                 
                if ($selcust->num_rows() > 0) {
               
                $pp=array();
                $i=0;
                foreach($selcust->result_array() as $rowemi)
                {
                     if ($rowemi['etype']==1){
                             
                    $k[$i] = array("id"=>$rowemi['id'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No.'.$rowemi['emi_no'],"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']*-1);
                    $i=$i+1;
                    if ($rowemi['received']>0)
                    {
                        $k[$i] = array("id"=>$rowemi['id'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No'.$rowemi['emi_no'].' Receipt' ,"emi_date"=>$rowemi['received_date'],"emi_amt"=>$rowemi['received']);
                        $i=$i+1;
                        
                    }
                    
                     }
                     
                     else{
                         
                                   
                    $k[$i] = array("id"=>$rowemi['id'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No.'.$rowemi['emi_no'].' Late Penalty',"emi_date"=>$rowemi['emi_date'],"emi_amt"=>$rowemi['emi_amt']*-1);
                    $i=$i+1;
                    if ($rowemi['received']>0)
                    {
                        $k[$i] = array("id"=>$rowemi['id'],"lanid"=>$rowemi['loan_id'],"lan"=>$rowemi['loan_no'],"emi_no"=>'EMI No'.$rowemi['emi_no'].' Charges Received' ,"emi_date"=>$rowemi['received_date'],"emi_amt"=>$rowemi['received']);
                        $i=$i+1;
                        
                    }
                     }
                         
                    
            
                }
               // $result['emi'] = $k;
                $pp[] = $k;
               
                $returnArr = array("data"=>$k,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Party List Get successfully!");
                }
                else
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Party Not Found!");
                }
            echo json_encode($returnArr);
            }
            else
            {
            echo "dont touch";
            }

        }

        function code(){

            $this->db->select('*');
			$this->db->from('code');
            $query = $this->db->get();
          
         //   $query = $this->db->where('categories');
            $myarray = array();
            if ($query->num_rows() > 0) {
                    foreach($query->result_array() as $row)
                    {
                        $myarray[] = $row;
                    }
            }
            // $sel = $con->query("select * from code");
            // $myarray = array();
            // while($row = $sel->fetch_assoc())
            // {
            //             $myarray[] = $row;
            // }
            $returnArr = array("data"=>$myarray,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Country Code List Founded!");
            echo json_encode($returnArr);
        }


        function profile(){
            $data = json_decode(file_get_contents('php://input'), true);
                if($data['name'] == '' or $data['email'] == '' or $data['mobile'] == '' or $data['imei']==''  or $data['password'] == '' or $data['ccode'] == '')
                {
                    
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                }
                else
                {
                    $name = $data['name'];
                    $email = $data['email'];
                    $mobile = $data['mobile'];
                    $ccode = $data['ccode'];
                    $imei = $data['imei'];
                    $password = $data['password'];
                    $uid =  $data['uid'];
               
                    //$checkimei = mysqli_num_rows(mysqli_query($con,"select * from users where  `id`=".$uid.""));
                    $credential	=	array('id' => $uid);
                    $checkimei = $this->db->get_where('users' , $credential);
               
                    //if($checkimei != 0)
                    if ($checkimei->num_rows() > 0) {
                       if($uid == 1)
                        {
                         // date_default_timezone_set('Asia/Kolkata');
                        $timestamp = date("Y-m-d H:i:s");
                    
                            $c = mysqli_fetch_assoc(mysqli_query($con,"select * from users where id='".$uid."'"));
                        //  $dc = mysqli_fetch_assoc(mysqli_query($con,"select * from area_dbs where name='".$c['area']."'"));
                        $returnArr = array("user"=>$c,"d_charge"=>"0","ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"UPDATE are DISABLED.");
                        }
                        else 
                        {

                            $datausers['name']=$name;
                            $datausers['email']=$email;
                            $datausers['mobile']=$mobile;
                            $datausers['password']=$password;
                            $datausers['ccode']=$ccode;
                           
                            $this->db->where('id', $uid);
                            $this->db->update('users', $datausers);


                            $credential	=	array('id' => $uid);
                            $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                            $selcust = $this->db->get_where('users' , $credential);

                            foreach($selcust->result_array() as $row)
                            {
                                $c = $selcust->row();
                            }
                        //   $con->query("update users set name='".$name."',email='".$email."',mobile='".$mobile."',password='".$password."',ccode='".$ccode."' where id=".$uid."");
                            // $c = $con->query("select * from user where id='".$uid."'");
                            // $c = $c->fetch_assoc();
                        //  $dc = $con->query("select * from area_dbs where name='".$c['area']."'");
                        // $dc = $dc->fetch_assoc();
                        //$returnArr = array("user"=>$c,"d_charge"=>"0","ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Profile Update successfully!");
                        $returnArr = array("user"=>$c,"ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Profile Update successfully!");
                    }
                    }
                    else
                    {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Request To Update Own Device!!!!");  
                    }
                    
                }

                echo json_encode($returnArr);
        }

            function forgot(){
                $data = json_decode(file_get_contents('php://input'), true);
                $ref_no='';
                $kstr=0;
                if(array_key_exists('ref_no', $data)) {
                    //key exists, do stuff
                    $kstr=1;
                    $ref_no = $data['ref_no'];
                }

                // if ($kstr==1){
                   
                    $sstr='';
                    // $sstr="(select mobile from super_stockists where mobile='".$ref_no."') union (select mobile from stockists where mobile='".$ref_no."')";
                    // $checkstockist = $con->query($sstr);
                    
                    $credential	=	array('mobile' => $ref_no);
                    $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                    $this->db->where('type',3);
                    $this->db->or_where('type',4);
                    $selcust = $this->db->get_where('users' , $credential);
                    
                    if(($selcust->num_rows()== 0 || $ref_no=='') && $kstr==1) {
                        
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Invalid Stockist Number!");
                        
                    }

                // }
                    
                    else{
                if($data['email'] == '' or $data['ccode'] == '')
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                }
                else
                {

                    $credential	=	array('mobile' => $data['email'],'ccode'=>$data['ccode'],'type'=>11);
                    $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                    $selcust = $this->db->get_where('users' , $credential);
                    
                   // $search = $con->query("select * from users where mobile='".$data['email']."' and ccode='".$data['ccode']."'");
                    if ($selcust->num_rows() > 0) {
                            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Otp Send Successfully!!!");
                    }
                    else{
                            $returnArr = array("ResponseCode"=>"401","Result"=>"false1","ResponseMsg"=>"Mobile Number Not Registered!!");
                    }
                }

                }
                echo json_encode($returnArr);
            }


            function pinmatch(){
                $data = json_decode(file_get_contents('php://input'), true);

                $pin = $data['pin'];
                $password = $data['password'];
                if ($pin =='' or $password =='')
                {
                $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went wrong  try again !");
                }
                else 
                {
                    
                    $pin = $pin;
                    $password =$password;

                    $credential	=	array('mobile' => $pin);
                    $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                    $selcust = $this->db->get_where('users' , $credential);
                    
                   // $counter = $con->query("select * from user where mobile='".$pin."'");
                    
                   
                    
                   if ($selcust->num_rows() > 0) {
                  
                     //$con->query("update user set password='".$password."' where mobile='".$pin."'");
                   
                     $datausers['password']=$password;
                     $this->db->where('mobile', $pin);
                     $this->db->update('users', $datausers);

                   
                     $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Password Changed Successfully!!!!!");    
                    }
                    else
                    {
                     $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"mobile Not Matched!!!!");  
                    }
                }
                
                echo json_encode($returnArr);

            }

            function register(){
                $data = json_decode(file_get_contents('php://input'), true);
                if($data['name'] == '' or $data['email'] == '' or $data['mobile'] == '' or $data['imei']==''  or $data['password'] == '' or $data['ccode'] == '')
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                }
                else
                {
                    $aadhar_img="";
                    $aadhar_img_back="";
                    $pan_img="";
                    
                    $name = $data['name'];
                    $email = $data['email'];
                    $mobile = $data['mobile'];
                    $ccode = $data['ccode'];
                    $imei = $data['imei'];
                    $password = $data['password'];
                    $firm_name = $data['firm_name'];
                    $ref_no = $data['ref_no'];
                    $trade_no = $data['trade_no'];
                    $aadhaar_no = $data['aadhaar_no'];
                    
                    
                    $sstr='';
                    // $sstr="(select  id,1 as utype,mobile,0 as aid  from super_stockists where mobile='".$ref_no."') union (select id,2 as utype,mobile,aid from stockists where mobile='".$ref_no."')";
                    // $checkstockist = $con->query($sstr);

                    $credential	=	array('mobile' => $ref_no);
                    $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                    $this->db->where('type',3);
                    $this->db->or_where('type',4);
                    $checkstockist = $this->db->get_where('users' , $credential);
                    
                    
                    if($checkstockist->num_rows()== 0 || $ref_no=='') {
                        
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Invalid Reference Number!");
                        
                        
                    }
                    
                    else{
                    
                    
                        $credential	=	array('mobile' => $mobile);

                        $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                        $checkmob = $this->db->get_where('users' , $credential); 
                        
                        $credential	=	array('email' => $email);

                        $this->db->select('id,name,shop_name,ccode,email,mobile,status');
                        $checkmail = $this->db->get_where('users' , $credential);   
                    
                    // $checkmob = $con->query("select * from users where mobile='".$mobile."'");
                    // $checkemail = $con->query("select * from users where mobile='".$email."'");
                
                    if($checkmob->num_rows() != 0)
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Mobile Number Already Used!");
                    }
                    else if($checkmail->num_rows() != 0)
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Email Address Already Used!");
                    }
                    else
                    {
                        $ssid=0;
                        $sid=0;
                        $utype=0;
                        
                        // $sstr="(select  id,1 as utype,mobile,0 as aid  from super_stockists where mobile='".$ref_no."') union (select id,2 as utype,mobile,aid from stockists where mobile='".$ref_no."')";
                        // $checkstockist = $con->query($sstr);
                       
                        $credential	=	array('mobile' => $ref_no);
                        $this->db->select('id,name,shop_name,ccode,email,mobile,status,type,super_stock_id');
                        $this->db->where('type',3);
                        $this->db->or_where('type',4);
                        $getstockist = $this->db->get_where('users' , $credential);
                       
                       
                       
                       
                       // while ($row = $checkstockist->fetch_assoc()) {

                            foreach($getstockist->result_array() as $row){
                            
                            $utype=$row['type'];
                            if($utype==3){
                                $ssid=$row['id'];
                                $utype=1;
                            }else{
                                $sid=$row['id'];
                                $ssid=$row['super_stock_id'];
                                $utype=0;
                            }
                            
                        }
                        
                        
                        
                    
                        $timestamp = date("Y-m-d H:i:s");

                      $this->db->trans_start();
                      $dataemi['name']              = $name;
                      $dataemi['imei']              = $imei;
                      $dataemi['email']             = $email;
                      $dataemi['mobile']            = $mobile;
                      $dataemi['rdate']             = $timestamp;
                      $dataemi['password']          = $password;
                      $dataemi['ccode']             = $ccode;
                      $dataemi['shop_name']         = $firm_name;
                      $dataemi['aadhaar_no']        = $aadhaar_no;
                      $dataemi['lic_no']            = $trade_no;
                      $dataemi['ref_no']            = $ref_no;
                      $dataemi['stock_id']          = $sid;
                      $dataemi['super_stock_id']    = $ssid;
                      $dataemi['is_direct']         = $utype;
                      $dataemi['type']              = 11;
                               
                      $this->db->insert('users', $dataemi);

                      $last_id =$this->db->insert_id();
                      
                      if ($this->db->trans_status() === FALSE)
                      {
                              $this->db->trans_rollback();
                      }
                      else
                      {
                              $this->db->trans_commit();
                      }

                        
                        // $con->query("insert into users(`name`,`imei`,`email`,`mobile`,`rdate`,`password`,`ccode`,`shop_name`,`aadhaar_no`,`lic_no`,`ref_no`,`stock_id`,`super_stock_id`,`is_direct`)values('".$name."','".$imei."','".$email."','".$mobile."','".$timestamp."','".$password."','".$ccode."','".$firm_name."','".$aadhaar_no."','".$trade_no."','".$ref_no."',".$sid.",".$ssid.",".$utype.")");
                    
                        // $last_id = $con->insert_id;
                                              
                        //stck_count
                       
                        if($utype==1){
                           // $datausers['id']=$uid;
                            $this->db->set('dealer_count', "dealer_count+1", false);
                            $this->db->where('id', $ssid);
                            $this->db->update('super_stockists');
                            
                                 //$con->query("update super_stockists set dealer_count=dealer_count+1 where  id=".$ssid."");
                            }
                            else{
                                $this->db->set('dealer_count', "dealer_count+1", false);
                                $this->db->where('id', $sid);
                                $this->db->update('stockists');
                                //$con->query("update stockists set dealer_count=dealer_count+1 where  id=".$sid."");
                            }

                        $p_img = $data['aadhaar_front'];
                        if ($p_img=="")
                            $aadhar_img='uploads/noimage.png';
                        else
                            $aadhar_img=$this->common_model->storeimage_dealer($p_img,$last_id,'AF');
                
                    //aadhaar back        
                    $p_img = $data['aadhaar_back'];
                        if ($p_img=="")
                            $aadhar_img_back='uploads/noimage.png';
                        else
                        $aadhar_img_back=$this->common_model->storeimage_dealer($p_img,$last_id,'AB');
                
                    //Pancard     
                    
                    $p_img = $data['trade_img'];
                        if ($p_img=="")
                            $pan_img='uploads/noimage.png';
                        else
                            $pan_img=$this->common_model->storeimage_dealer($p_img,$last_id,'TL');
                

                            $datauser['aadhaar_front']=$aadhar_img;
                            $datauser['aadhaar_back']=$aadhar_img_back;
                            $datauser['lic_photo']=$pan_img;
                            $this->db->where('id', $last_id);
                            $this->db->update('users', $datauser);

                          //  $con->query("update users set aadhaar_front='".$aadhar_img."',aadhaar_back='".$aadhar_img_back."',lic_photo='".$pan_img."' where  id=".$last_id);



                        $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Registration successfully!");
                    }
                    
                    }
                }

                echo json_encode($returnArr);
            }

            function pdf_asset_order($param1 = '' , $param2 = ''){
                
                    $data['system_name']    =   $this->db->get_where('config' , array('title'=>'system_name'))->row()->value;    
                    $data['company_name']   =   $this->db->get_where('config' , array('title'=>'company_name'))->row()->value;
                    $data['address']        =   $this->db->get_where('config' , array('title'=>'address'))->row()->value;
                    $data['system_email']   =   $this->db->get_where('config' , array('title'=>'system_email'))->row()->value;
                    $data['phone']          =   $this->db->get_where('config' , array('title'=>'phone'))->row()->value;
                    $data['physical_sign']  =   $this->db->get_where('config' , array('title'=>'physical_sign'))->row()->value;
                    $data['param1']         = $param1;            
                    $data['gatepasses']      = $this->db->get_where('orders' , array('loan_no' => $param1) )->result_array();   
                    $data['page_name']      = 'asset_gatepass_details';
                    $data['page_title']     = 'Asset Gate Pass';
                    $html                   = $this->load->view('pdf/agreement', $data,true);            
                    $pdfFilePath            = 'uploads/temp/'."Agreement_".date('dmY')."_".$param1.".pdf";
                    $this->load->library('m_pdf');
                    $footer                 ='';// ''';
                    $this->m_pdf->pdf->SetHTMLFooter($footer."Page {PAGENO} of {nb}");
                    $this->m_pdf->pdf->WriteHTML($html); 
                    //download it.
                    $this->m_pdf->pdf->Output($pdfFilePath, "D");
                    //$this->m_pdf->pdf->Output($pdfFilePath, "F");
                    //$returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>$pdfFilePath);
                    //echo json_encode($returnArr);
        
            }
            
        function wallet(){
                $data = json_decode(file_get_contents('php://input'), true);
                    if($data['uid'] == '' or $data['amount'] == '')
                    {
                        $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went Wrong!");
                    }
                    else
                    {
                        $uid =$data['uid'];
                        $amount = $data['amount'];

                        $credential	=	array('user_id' => $uid,'amount' => $amount,'approval'=>0,'TIMESTAMPDIFF(MINUTE, created_at,now())>' => 0,);
                        $wallet = $this->db->get_where('wallets' , $credential);
                        
                        //$results = $con->query("select * from wallets where user_id='.$uid.' and amount='.$amount.' and TIMESTAMPDIFF(MINUTE, created_at,now())>0");
                        
                        if($wallet->num_rows() >0 )
                        {
                            $returnArr = array("ResponseCode"=>"201","Result"=>"true","ResponseMsg"=>"Please Try After Sometime!");
                                            
                        }else{

                            $this->db->trans_start();


                            $stockid=0;
                            $compid=0;

                            $credential	=	array('id' => $data['uid']);
                            $getstockist = $this->db->get_where('users' , $credential);
                            foreach($getstockist->result_array() as $row){
                                  
                                $utype=$row['is_direct'];
                                $compid=$row['comp_id'];
                                if($utype==1){
                                    $stockid=$row['super_stock_id'];
                                   
                                }else if($utype==0){
                                   
                                    $stockid=$row['stock_id'];
                                   
                                }
                                
                            }
        
                            if($stockid==0)
                               $stockid=$his->common_model->get_comp_user_id($compid);




                            $datarecharge['user_id']              = $data['uid'];
                            $datarecharge['request_id']           = 0;
                            $datarecharge['payment_method']       = 'QR';
                            $datarecharge['amount']               = $data['amount'];
                            $datarecharge['approval']             = 0;
                            $datarecharge['send_to']              = $stockid;

                            $this->db->insert('wallets', $datarecharge);
                            $last_id =$this->db->insert_id();
                            
                            if ($this->db->trans_status() === FALSE)
                            {
                                    $this->db->trans_rollback();
                            }
                            else
                            {
                                    $this->db->trans_commit();
                            }

                            // $query="insert into wallets(`user_id`,`request_id`,`payment_method`,`amount`,`approval`)values(".$data['uid'].",0,'QR',".$data['amount'].",0)";

                            // $con->query( $query);

                            // $cust_id = $con->insert_id;
                            
                            $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Request Placed Successfully!");
                        }
                        
                        
                    
                        
                    }
                    echo json_encode($returnArr);
            }

            
            function getqr(){
                $data = json_decode(file_get_contents('php://input'), true);
 
                $uid = $data['uid'];
                if($uid == '')
                {
                    $returnArr = array("ResponseCode"=>"401","Result"=>"false","ResponseMsg"=>"Something Went wrong  try again !");
                }
                else 
                {

                    $stockid=0;
                    $compid=0;
                    $credential	=	array('id' => $uid);
                    $getstockist = $this->db->get_where('users' , $credential);
                    foreach($getstockist->result_array() as $row){
                        $compid=$row['comp_id'];
                        $utype=$row['is_direct'];
                        if($utype==1){
                            $stockid=$row['super_stock_id'];
                           
                        }else if($utype==0){
                           
                            $stockid=$row['stock_id'];
                           
                        }
                        
                    }

                    if($stockid==0)
                        $stockid=$his->common_model->get_comp_user_id($compid);
                    
                    
                    $qr_code=''; 
                    $qr_code = 'uploads/upi_qr/'.md5($stockid).'.jpg';
                    $returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>$qr_code);
                }

                    echo json_encode($returnArr);
            }

}