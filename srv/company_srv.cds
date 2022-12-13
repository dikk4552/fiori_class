using demo.company from '../db/company';

service CompanyService{
    entity Company as projection on company.Company;
    entity Company_state as projection on company.Company_state;

}