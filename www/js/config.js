var pdfurls = [];

pdfurls['lesson']   = 'http://gotsafety.com/assets/images/admin/lession_attachment/'
pdfurls['logs']     = 'http://gotsafety.com/images/frontend/logs/';
pdfurls['reports']  = 'http://gotsafety.com/assets/images/frontend/inspection_reports/';
pdfurls['records']  = 'http://gotsafety.com/assets/images/frontend/records/';
pdfurls['docs'] 	= 'http://gotsafety.com/assets/images/frontend/call_osha/';
pdfurls['forms']    = 'http://gotsafety.com/assets/images/frontend/safety_forms/';
pdfurls['posters']  = 'http://gotsafety.com/assets/images/frontend/posters_attachment/';

angular.module('starter.constants',[])  
  .constant('AppConfig',{'apiUrl': 'http://gotsafety.com/service/'})
  .constant('pdfUrls',pdfurls);