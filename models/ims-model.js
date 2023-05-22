"use strict";
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;

let eForm = {
  FWTCaseEformNew : {
    CaseReference : null,
    EformName : config.ims.eformDefinition,
  },
  FLCaseEformInstance : {
    CaseReference : null,
    EformName : config.ims.eformName
  }
};

let eformData = {
  FLEformFields : {
    CaseEformInstance : {
      CaseReference : null,
      EformName : config.ims.eformName
    },
    EformData : {
      EformFields : [
        {
          "FieldName": "auditaction",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutcontime",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbosponsor",
          "FieldValue": ""
        },
        {
          "FieldName": "cbpermorenationality",
          "FieldValue": ""
        },
        {
          "FieldName": "cbpereditnationalityholder",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "rdsubmitfeedback",
          "FieldValue": ""
        },
        {
          "FieldName": "txslatitle",
          "FieldValue": "undefined-undefined 30 Days - Smuggling"
        },
        {
          "FieldName": "pernonuklocpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txtraveluktranmode",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostuddays",
          "FieldValue": ""
        },
        {
          "FieldName": "sourcesystem",
          "FieldValue": "Protect Sources"
        },
        {
          "FieldName": "txaboutreported",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditninum",
          "FieldValue": ""
        },
        {
          "FieldName": "txabouttel",
          "FieldValue": ""
        },
        {
          "FieldName": "personpob",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworkmob",
          "FieldValue": ""
        },
        {
          "FieldName": "dtboactiondate",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboproc",
          "FieldValue": ""
        },
        {
          "FieldName": "txpersonhours",
          "FieldValue": ""
        },
        {
          "FieldName": "lsportarrivalboat",
          "FieldValue": ""
        },
        {
          "FieldName": "cache_clear_end",
          "FieldValue": ""
        },
        {
          "FieldName": "cbalcohol",
          "FieldValue": "1"
        },
        {
          "FieldName": "rdwhocompdisabled",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworkaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompdays",
          "FieldValue": ""
        },
        {
          "FieldName": "tkhowdk",
          "FieldValue": "0"
        },
        {
          "FieldName": "lstraincomp",
          "FieldValue": ""
        },
        {
          "FieldName": "rdreportagain",
          "FieldValue": "No"
        },
        {
          "FieldName": "ukwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "ukplace",
          "FieldValue": ""
        },
        {
          "FieldName": "uploadcount",
          "FieldValue": ""
        },
        {
          "FieldName": "tcaboutstatement",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhendisabled",
          "FieldValue": "1"
        },
        {
          "FieldName": "txsladate",
          "FieldValue": ""
        },
        {
          "FieldName": "txbomobile",
          "FieldValue": "07712400479"
        },
        {
          "FieldName": "txpermoreninumholder",
          "FieldValue": ""
        },
        {
          "FieldName": "dtpereditdob",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreidcardholder",
          "FieldValue": ""
        },
        {
          "FieldName": "rdreportperson",
          "FieldValue": "No"
        },
        {
          "FieldName": "passed_in_user_id",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpersonemployed",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermorefamname",
          "FieldValue": ""
        },
        {
          "FieldName": "personsex",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhen",
          "FieldValue": ""
        },
        {
          "FieldName": "cbliedapp",
          "FieldValue": "0"
        },
        {
          "FieldName": "txcompmoreanother",
          "FieldValue": ""
        },
        {
          "FieldName": "txcompmoreidcard",
          "FieldValue": ""
        },
        {
          "FieldName": "lscountry",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudinstit",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompemail",
          "FieldValue": ""
        },
        {
          "FieldName": "lstrainportarr",
          "FieldValue": ""
        },
        {
          "FieldName": "caseid",
          "FieldValue": ""
        },
        {
          "FieldName": "txpervechelse",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbogroup",
          "FieldValue": "ImmigrationGroup"
        },
        {
          "FieldName": "txperworkowner",
          "FieldValue": ""
        },
        {
          "FieldName": "txpostother",
          "FieldValue": ""
        },
        {
          "FieldName": "personpassport",
          "FieldValue": ""
        },
        {
          "FieldName": "txsourceaccess",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocemail",
          "FieldValue": ""
        },
        {
          "FieldName": "txbosourcedoc",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "rdcrimetype",
          "FieldValue": "Smuggling"
        },
        {
          "FieldName": "rdpervechowner",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudukwhere",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpervechcolour",
          "FieldValue": ""
        },
        {
          "FieldName": "rdhowvehicletraveltransport",
          "FieldValue": ""
        },
        {
          "FieldName": "cbhumantraf",
          "FieldValue": "0"
        },
        {
          "FieldName": "current_user_id_2",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutrelationship",
          "FieldValue": ""
        },
        {
          "FieldName": "current_user_id_1",
          "FieldValue": ""
        },
        {
          "FieldName": "txboathena",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereanothertelephone",
          "FieldValue": ""
        },
        {
          "FieldName": "perukloctelephone",
          "FieldValue": ""
        },
        {
          "FieldName": "lsairplanecondept",
          "FieldValue": ""
        },
        {
          "FieldName": "cbstudent",
          "FieldValue": "0"
        },
        {
          "FieldName": "txintid",
          "FieldValue": "[intid]"
        },
        {
          "FieldName": "eformcreationdate",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworkpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocomppost",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txwheretelephone",
          "FieldValue": ""
        },
        {
          "FieldName": "casenum_1",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocaddresstype",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbopriority",
          "FieldValue": ""
        },
        {
          "FieldName": "lsgovtdept",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpermoregender",
          "FieldValue": ""
        },
        {
          "FieldName": "txwheremobile",
          "FieldValue": ""
        },
        {
          "FieldName": "rdchildren",
          "FieldValue": "No"
        },
        {
          "FieldName": "cbcompmorenationality",
          "FieldValue": ""
        },
        {
          "FieldName": "countryws",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocmobile",
          "FieldValue": ""
        },
        {
          "FieldName": "xg90lurday9k8i2",
          "FieldValue": "denied"
        },
        {
          "FieldName": "txwhocompknow",
          "FieldValue": ""
        },
        {
          "FieldName": "cbillegalemp",
          "FieldValue": "0"
        },
        {
          "FieldName": "caseref",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhocompanother",
          "FieldValue": "No"
        },
        {
          "FieldName": "lsjobtype",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditapproxage",
          "FieldValue": ""
        },
        {
          "FieldName": "ukpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txmastercopy",
          "FieldValue": "1"
        },
        {
          "FieldName": "txvechmodel",
          "FieldValue": ""
        },
        {
          "FieldName": "txotheranyinfo",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfalowlocal",
          "FieldValue": ""
        },
        {
          "FieldName": "tximmother",
          "FieldValue": ""
        },
        {
          "FieldName": "txtimedepaero",
          "FieldValue": ""
        },
        {
          "FieldName": "dtpermoredobholder",
          "FieldValue": ""
        },
        {
          "FieldName": "l5je3wo4ovvo2noh",
          "FieldValue": "denied"
        },
        {
          "FieldName": "txwhocompwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereemail",
          "FieldValue": ""
        },
        {
          "FieldName": "cbother",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdaboutcontact",
          "FieldValue": "No"
        },
        {
          "FieldName": "lsinvolve",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudemail",
          "FieldValue": ""
        },
        {
          "FieldName": "rdborisk",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboinfo",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutsecurity",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbosourceeval",
          "FieldValue": ""
        },
        {
          "FieldName": "txtravelukarrivalloc",
          "FieldValue": ""
        },
        {
          "FieldName": "staffuserid",
          "FieldValue": "verinttest"
        },
        {
          "FieldName": "txvehcolour",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditothernameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "viewmode",
          "FieldValue": "C"
        },
        {
          "FieldName": "rdperworkknow",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudtel",
          "FieldValue": ""
        },
        {
          "FieldName": "lswherecountry",
          "FieldValue": ""
        },
        {
          "FieldName": "txpersondays",
          "FieldValue": ""
        },
        {
          "FieldName": "lswhereanothercountry",
          "FieldValue": ""
        },
        {
          "FieldName": "txcompmoreothername",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboillegal",
          "FieldValue": ""
        },
        {
          "FieldName": "derivedcaseid",
          "FieldValue": ""
        },
        {
          "FieldName": "personalias",
          "FieldValue": ""
        },
        {
          "FieldName": "txbobrref",
          "FieldValue": ""
        },
        {
          "FieldName": "dtbocidremoval",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhenhappen",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboabuse",
          "FieldValue": ""
        },
        {
          "FieldName": "lsvehicle",
          "FieldValue": ""
        },
        {
          "FieldName": "txpostother3",
          "FieldValue": ""
        },
        {
          "FieldName": "txpostother2",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpereditgender",
          "FieldValue": ""
        },
        {
          "FieldName": "txpostother4",
          "FieldValue": ""
        },
        {
          "FieldName": "txbocrs",
          "FieldValue": ""
        },
        {
          "FieldName": "txsubmittitle",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpermoregenderholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereanothermobile",
          "FieldValue": ""
        },
        {
          "FieldName": "personninum",
          "FieldValue": ""
        },
        {
          "FieldName": "dtpermoredob",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbodocuments",
          "FieldValue": ""
        },
        {
          "FieldName": "dtcompmoredob",
          "FieldValue": ""
        },
        {
          "FieldName": "cache_clear_start",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreninum",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermorefname",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbritgovtemp",
          "FieldValue": ""
        },
        {
          "FieldName": "txvieweditsource",
          "FieldValue": ""
        },
        {
          "FieldName": "cbaboutnat",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboharm",
          "FieldValue": ""
        },
        {
          "FieldName": "txvehreg",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworkemail",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhowhere",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfalownat",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreapproxageholder",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukemail",
          "FieldValue": ""
        },
        {
          "FieldName": "ukmobile",
          "FieldValue": ""
        },
        {
          "FieldName": "rdborepresentitive",
          "FieldValue": ""
        },
        {
          "FieldName": "txsmugother",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonukloccountry",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditfamname",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwherecrime",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditfnameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "auditactionviewend",
          "FieldValue": "view source end"
        },
        {
          "FieldName": "lsboattype",
          "FieldValue": ""
        },
        {
          "FieldName": "auditaction2",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "personsurname",
          "FieldValue": "uwais"
        },
        {
          "FieldName": "rdbonotact",
          "FieldValue": ""
        },
        {
          "FieldName": "dtpereditdobholder",
          "FieldValue": ""
        },
        {
          "FieldName": "cbillegwork",
          "FieldValue": "0"
        },
        {
          "FieldName": "txtrainportdep",
          "FieldValue": ""
        },
        {
          "FieldName": "txportdepaero",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostuduk",
          "FieldValue": ""
        },
        {
          "FieldName": "txcompmorefamname",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereanotheraddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txbodept",
          "FieldValue": "test"
        },
        {
          "FieldName": "rdaboutgender",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukplace",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutdob",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereanotherpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "rdboact",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfanoinfo",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditpassport",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwheredisabled",
          "FieldValue": "1"
        },
        {
          "FieldName": "rdbodisable",
          "FieldValue": "0"
        },
        {
          "FieldName": "tkhowboat",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdbostatus",
          "FieldValue": ""
        },
        {
          "FieldName": "rdborec",
          "FieldValue": "Online"
        },
        {
          "FieldName": "txvehmake",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutmobile",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworkcomp",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutemail",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreothername",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutplace",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhereanotheremail",
          "FieldValue": ""
        },
        {
          "FieldName": "rdaboutmarital",
          "FieldValue": ""
        },
        {
          "FieldName": "current_user_id",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocaddresstype",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreallholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhenstart",
          "FieldValue": ""
        },
        {
          "FieldName": "rdaboutaction",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhenhappen",
          "FieldValue": ""
        },
        {
          "FieldName": "rdaboutcontactro",
          "FieldValue": ""
        },
        {
          "FieldName": "lsportarraero",
          "FieldValue": ""
        },
        {
          "FieldName": "tbwhoaddperson",
          "FieldValue": ""
        },
        {
          "FieldName": "tiwhenhappen",
          "FieldValue": ""
        },
        {
          "FieldName": "persondob",
          "FieldValue": ""
        },
        {
          "FieldName": "nonuktelephone",
          "FieldValue": ""
        },
        {
          "FieldName": "cbcigtob",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdpermoreinfomore",
          "FieldValue": "No"
        },
        {
          "FieldName": "personname",
          "FieldValue": ""
        },
        {
          "FieldName": "txtimedep",
          "FieldValue": ""
        },
        {
          "FieldName": "lsboresearch",
          "FieldValue": ""
        },
        {
          "FieldName": "rdabout18ro",
          "FieldValue": ""
        },
        {
          "FieldName": "cbpermorenationalityholder",
          "FieldValue": ""
        },
        {
          "FieldName": "auditthread",
          "FieldValue": "101179584821"
        },
        {
          "FieldName": "rdwhostudadd",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditninumholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txdidstart",
          "FieldValue": ""
        },
        {
          "FieldName": "rdhowdisabled",
          "FieldValue": "1"
        },
        {
          "FieldName": "txbofname",
          "FieldValue": "ruth"
        },
        {
          "FieldName": "txwhocompvat",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocmobile",
          "FieldValue": ""
        },
        {
          "FieldName": "cbfirearm",
          "FieldValue": "0"
        },
        {
          "FieldName": "txboatname",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermorefnameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txperworktel",
          "FieldValue": ""
        },
        {
          "FieldName": "tkhowvehicle",
          "FieldValue": "0"
        },
        {
          "FieldName": "txwhocount",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonukloctelephone",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermorepassport",
          "FieldValue": ""
        },
        {
          "FieldName": "lstraindepcountry",
          "FieldValue": ""
        },
        {
          "FieldName": "rdabout18",
          "FieldValue": "No"
        },
        {
          "FieldName": "rddisabled",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdperwork",
          "FieldValue": ""
        },
        {
          "FieldName": "tbboresearch",
          "FieldValue": ""
        },
        {
          "FieldName": "cbbogmar",
          "FieldValue": "0"
        },
        {
          "FieldName": "txpereditidcardholder",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpervechreg",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditothername",
          "FieldValue": ""
        },
        {
          "FieldName": "txbocentur",
          "FieldValue": ""
        },
        {
          "FieldName": "cbpersonnat",
          "FieldValue": ""
        },
        {
          "FieldName": "casenum",
          "FieldValue": ""
        },
        {
          "FieldName": "txtimearraero",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutsurname",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompowns",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudhours",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocomptele",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhereanothercrime",
          "FieldValue": ""
        },
        {
          "FieldName": "personage",
          "FieldValue": ""
        },
        {
          "FieldName": "lscomptype",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhoreportorg",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpervechmake",
          "FieldValue": ""
        },
        {
          "FieldName": "ukemail",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfanooff",
          "FieldValue": ""
        },
        {
          "FieldName": "auditactionviewbegin",
          "FieldValue": "view source begin"
        },
        {
          "FieldName": "cbothersmug",
          "FieldValue": "0"
        },
        {
          "FieldName": "txflightnum",
          "FieldValue": ""
        },
        {
          "FieldName": "ukaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditfamnameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txtraintimearr",
          "FieldValue": ""
        },
        {
          "FieldName": "cbcashsmug",
          "FieldValue": "0"
        },
        {
          "FieldName": "lsboimmcategories",
          "FieldValue": ""
        },
        {
          "FieldName": "cbaboutjob",
          "FieldValue": ""
        },
        {
          "FieldName": "personidnum",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "txcompmorepassport",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukmobile",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudmanknow",
          "FieldValue": ""
        },
        {
          "FieldName": "nonukaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txarrtime",
          "FieldValue": ""
        },
        {
          "FieldName": "cbfakedoc",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdwhodisabled",
          "FieldValue": "1"
        },
        {
          "FieldName": "rdbobreached",
          "FieldValue": ""
        },
        {
          "FieldName": "lsbowhodeal",
          "FieldValue": ""
        },
        {
          "FieldName": "tbboaction",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhendontknow",
          "FieldValue": ""
        },
        {
          "FieldName": "initialform",
          "FieldValue": ""
        },
        {
          "FieldName": "txcompmorefname",
          "FieldValue": ""
        },
        {
          "FieldName": "setsla",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdwhostudmob",
          "FieldValue": ""
        },
        {
          "FieldName": "auditactiondenied",
          "FieldValue": "unauthorised access attempt"
        },
        {
          "FieldName": "txwhocomphours",
          "FieldValue": ""
        },
        {
          "FieldName": "txairlinecomp",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbonfa",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditall",
          "FieldValue": ""
        },
        {
          "FieldName": "tkhowaeroplane",
          "FieldValue": "0"
        },
        {
          "FieldName": "txviewsource",
          "FieldValue": ""
        },
        {
          "FieldName": "txeditsource",
          "FieldValue": ""
        },
        {
          "FieldName": "txothergovtdept",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditallholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreidcard",
          "FieldValue": ""
        },
        {
          "FieldName": "auditactioneditbegin",
          "FieldValue": "edit source begin"
        },
        {
          "FieldName": "txpereditfname",
          "FieldValue": ""
        },
        {
          "FieldName": "txbootherresholder",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbolegally",
          "FieldValue": ""
        },
        {
          "FieldName": "txborepname",
          "FieldValue": ""
        },
        {
          "FieldName": "txotheranothercrime",
          "FieldValue": ""
        },
        {
          "FieldName": "cbhelpillegal",
          "FieldValue": "0"
        },
        {
          "FieldName": "txaboutrisk",
          "FieldValue": ""
        },
        {
          "FieldName": "txbosurname",
          "FieldValue": "uwais"
        },
        {
          "FieldName": "rdbowho",
          "FieldValue": "Other"
        },
        {
          "FieldName": "txboicw",
          "FieldValue": ""
        },
        {
          "FieldName": "lsbonextsteps",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditapproxageholder",
          "FieldValue": ""
        },
        {
          "FieldName": "tmborec",
          "FieldValue": "09:00"
        },
        {
          "FieldName": "txsubmitemail",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudcourse",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbobreachedcons",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutwhoknows",
          "FieldValue": ""
        },
        {
          "FieldName": "documentref",
          "FieldValue": ""
        },
        {
          "FieldName": "rdpereditgenderholder",
          "FieldValue": ""
        },
        {
          "FieldName": "peruklocplace",
          "FieldValue": ""
        },
        {
          "FieldName": "na",
          "FieldValue": "N/A"
        },
        {
          "FieldName": "txpermorefamnameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txboemail",
          "FieldValue": "test@homeoffice.gov.uk"
        },
        {
          "FieldName": "rdpervechmodel",
          "FieldValue": ""
        },
        {
          "FieldName": "cbnopermission",
          "FieldValue": "0"
        },
        {
          "FieldName": "rdbohandling",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreinfo",
          "FieldValue": ""
        },
        {
          "FieldName": "cbpereditnationality",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostud",
          "FieldValue": ""
        },
        {
          "FieldName": "txportdep",
          "FieldValue": ""
        },
        {
          "FieldName": "txabouthow",
          "FieldValue": ""
        },
        {
          "FieldName": "uktelephone",
          "FieldValue": "0118967890567"
        },
        {
          "FieldName": "txperworkwebsite",
          "FieldValue": ""
        },
        {
          "FieldName": "txbootherres",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermorepassportholder",
          "FieldValue": ""
        },
        {
          "FieldName": "lspervechtype",
          "FieldValue": ""
        },
        {
          "FieldName": "dtwhenhappen",
          "FieldValue": ""
        },
        {
          "FieldName": "txsubmitname",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutname",
          "FieldValue": ""
        },
        {
          "FieldName": "rdcompmoregender",
          "FieldValue": ""
        },
        {
          "FieldName": "countrywsholder",
          "FieldValue": ""
        },
        {
          "FieldName": "cbtravelukcountry",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfamalicious",
          "FieldValue": ""
        },
        {
          "FieldName": "txcrimetype",
          "FieldValue": "Smuggling"
        },
        {
          "FieldName": "rdboactcases",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudweb",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudman",
          "FieldValue": ""
        },
        {
          "FieldName": "tknfanoresource",
          "FieldValue": ""
        },
        {
          "FieldName": "txbonod",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocplace",
          "FieldValue": ""
        },
        {
          "FieldName": "txaboutpost",
          "FieldValue": ""
        },
        {
          "FieldName": "dtborec",
          "FieldValue": "08/03/2023"
        },
        {
          "FieldName": "txtimeofdeptrain",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompanything",
          "FieldValue": ""
        },
        {
          "FieldName": "sladate",
          "FieldValue": "26/04/2023"
        },
        {
          "FieldName": "cbboaction",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditidcard",
          "FieldValue": ""
        },
        {
          "FieldName": "rdwhostudpostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "lsnonukcountry",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocemail",
          "FieldValue": ""
        },
        {
          "FieldName": "eformname",
          "FieldValue": "EDITABLE"
        },
        {
          "FieldName": "rdaboutdisabled",
          "FieldValue": "1"
        },
        {
          "FieldName": "cbdrugsmug",
          "FieldValue": "0"
        },
        {
          "FieldName": "tkhowtrain",
          "FieldValue": "0"
        },
        {
          "FieldName": "txcompmoreninum",
          "FieldValue": ""
        },
        {
          "FieldName": "txwhocompbus",
          "FieldValue": ""
        },
        {
          "FieldName": "rdhowveh",
          "FieldValue": ""
        },
        {
          "FieldName": "txpereditpassportholder",
          "FieldValue": ""
        },
        {
          "FieldName": "txwherepostcode",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreothernameholder",
          "FieldValue": ""
        },
        {
          "FieldName": "errordetected",
          "FieldValue": ""
        },
        {
          "FieldName": "pernonuklocaddress",
          "FieldValue": ""
        },
        {
          "FieldName": "txbocid",
          "FieldValue": ""
        },
        {
          "FieldName": "txpermoreapproxage",
          "FieldValue": ""
        },
        {
          "FieldName": "rdbonfaact",
          "FieldValue": ""
        },
        {
          "FieldName": "txpersonother",
          "FieldValue": ""
        },
        {
          "FieldName": "auditactioneditend",
          "FieldValue": "edit source end"
        }



    ]
  }
  }
};

let document = {
  FWTDocument : {
    Document : '1101000 1100101 1101100 1101100 1101111',
    DocumentType : 1,
    DocumentName : 'test.txt'
  }
};

let notes = {
  FWTNoteToParentRef : {
    ParentId : null,
    ParentType : 0,
    NoteDetails : {
      Text: null,
        NoteLabels : {
          NoteLabel : 'test note label'
        },
       NoteAttachments : {
         NoteAttachmentList : {
          AttachmentName : 'test.txt',
          AttachmentIdentifier : null,
          AttachmentType: 0
         }
       }
    }
  }
};

const createClient = () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err)
        return reject(err);
      client.setEndpoint(config.ims.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      return resolve(client);
    }
  )
);

/************************************************************
 * @param {Object} caseType type of case to create
 * @param {Object} caseType.FWTCaseCreate
 * @param {String} caseType.FWTCaseCreate.ClassificationEventCode
 ************************************************************/
const createCase = (client, caseType) =>
  new Promise((resolve, reject) =>
      client.createCase(caseType,
      (err, result) => {
          if (err)
          return reject(err);
      console.log('Case reference: ' + JSON.stringify(result, null, 2));
      return resolve(result);
    }
  )
);

/************************************************************
 * @param {Object} eForm Case eForm to add
 * @param {Object} eForm.FWTCaseEformNew
 * @param {Object} eForm.FWTCaseEformNew.CaseReference
 * @param {String} eForm.FWTCaseEformNew.EformName
 ************************************************************/
  const addCaseForm = (client, caseRef) =>
    new Promise(function(resolve, reject){
      eForm.FWTCaseEformNew.CaseReference =
      eForm.FLCaseEformInstance.CaseReference = caseRef;
      client.addCaseEform(eForm,
        (err, result) => {
          if (err)
            return reject(err);

          return resolve(result);
        }
      )
    });

  /************************************************************
   * @param {Object} eformData Case eForm data
   * @param {Object} eformData.FLEformFields
   * @param {Object} eformData.FLEformFields.CaseEformInstance
   * @param {String} eformData.FLEformFields.CaseEformInstance.CaseReference
   * @param {String} eformData.FLEformFields.CaseEformInstance.EformName
   * @param {String} eformData.FLEformFields.EformData
   ************************************************************/
  const writeFormData = (client, caseRef) =>
    new Promise(function(resolve, reject) {
      let ids = {};
      eformData.FLEformFields.EformData.EformFields.map((item, index) => {ids[item.FieldName] = index})
      eformData.FLEformFields.CaseEformInstance.CaseReference =
      eformData.FLEformFields.EformData.EformFields[ids["casenum"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["casenum_1"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["caseid"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["caseref"]].FieldValue = caseRef;

      client.writeCaseEformData(eformData,
        (err, result) => (err ? reject(err) : resolve(result))
      )
    });


  const addDocument = (client, document) =>
    new Promise((resolve, reject) =>
      client.addDocumentToRepository(document,
        (err, result) => (err ? reject(err) : resolve(result))
      )
  );

  const createNotes = (client, notes) =>
    new Promise((resolve, reject) =>
      client.createNotes(document,
        (err, result) => (err ? reject(err) : resolve(result))
      )
  );

module.exports = {
  /** **********************************************************
   * @param {Object} caseType type of case to create
   * @param {Object} caseType.FWTCaseCreate
   * @param {String} caseType.FWTCaseCreate.ClassificationEventCode
   ************************************************************/
  createPublicAllegationsCase: async (caseType) => {

    const client = await createClient();

    const caseRef = await createCase(client, caseType);

    let result = await addCaseForm(client, caseRef);
    console.log('addCaseForm result: ' + JSON.stringify(result, null, 2));

    result = await writeFormData(client, caseRef);
    console.log('writeFormData result: ' + JSON.stringify(result, null, 2));

    // result = await addDocument(client, document);
    // console.log('addDocument result: ' + JSON.stringify(result, null, 2));

    // result = await createNotes(client, notes);
    // console.log('createNotes result: ' + JSON.stringify(result, null, 2));
  }
}
