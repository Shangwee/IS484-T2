from flask import jsonify
import time
from newspaper import article
from googlenewsdecoder import new_decoderv1
import os
from dotenv import load_dotenv
import google.generativeai as genai
import re
import json
import pandas as pd
import sqlite3
import requests
import ast
from rapidfuzz import process, fuzz
import spacy
import subprocess

load_dotenv()

sp500_plus2_dict = {'Security': {0: '3M',
  1: 'A. O. Smith',
  2: 'Abbott Laboratories',
  3: 'AbbVie',
  4: 'Accenture',
  5: 'Adobe Inc.',
  6: 'Advanced Micro Devices',
  7: 'AES Corporation',
  8: 'Aflac',
  9: 'Agilent Technologies',
  10: 'Air Products',
  11: 'Airbnb',
  12: 'Akamai Technologies',
  13: 'Albemarle Corporation',
  14: 'Alexandria Real Estate Equities',
  15: 'Align Technology',
  16: 'Allegion',
  17: 'Alliant Energy',
  18: 'Allstate',
  19: 'Alphabet Inc. (Class A)',
  20: 'Alphabet Inc. (Class C)',
  21: 'Altria',
  22: 'Amazon',
  23: 'Amcor',
  24: 'Ameren',
  25: 'American Electric Power',
  26: 'American Express',
  27: 'American International Group',
  28: 'American Tower',
  29: 'American Water Works',
  30: 'Ameriprise Financial',
  31: 'Ametek',
  32: 'Amgen',
  33: 'Amphenol',
  34: 'Analog Devices',
  35: 'Ansys',
  36: 'Aon plc',
  37: 'APA Corporation',
  38: 'Apollo Global Management',
  39: 'Apple Inc.',
  40: 'Applied Materials',
  41: 'Aptiv',
  42: 'Arch Capital Group',
  43: 'Archer Daniels Midland',
  44: 'Arista Networks',
  45: 'Arthur J. Gallagher & Co.',
  46: 'Assurant',
  47: 'AT&T',
  48: 'Atmos Energy',
  49: 'Autodesk',
  50: 'Automatic Data Processing',
  51: 'AutoZone',
  52: 'AvalonBay Communities',
  53: 'Avery Dennison',
  54: 'Axon Enterprise',
  55: 'Baker Hughes',
  56: 'Ball Corporation',
  57: 'Bank of America',
  58: 'Baxter International',
  59: 'Becton Dickinson',
  60: 'Berkshire Hathaway',
  61: 'Best Buy',
  62: 'Bio-Techne',
  63: 'Biogen',
  64: 'BlackRock',
  65: 'Blackstone Inc.',
  66: 'BNY Mellon',
  67: 'Boeing',
  68: 'Booking Holdings',
  69: 'Boston Scientific',
  70: 'Bristol Myers Squibb',
  71: 'Broadcom',
  72: 'Broadridge Financial Solutions',
  73: 'Brown & Brown',
  74: 'Brown–Forman',
  75: 'Builders FirstSource',
  76: 'Bunge Global',
  77: 'BXP, Inc.',
  78: 'C.H. Robinson',
  79: 'Cadence Design Systems',
  80: 'Caesars Entertainment',
  81: 'Camden Property Trust',
  82: "Campbell's Company (The)",
  83: 'Capital One',
  84: 'Cardinal Health',
  85: 'CarMax',
  86: 'Carnival',
  87: 'Carrier Global',
  88: 'Caterpillar Inc.',
  89: 'Cboe Global Markets',
  90: 'CBRE Group',
  91: 'CDW Corporation',
  92: 'Cencora',
  93: 'Centene Corporation',
  94: 'CenterPoint Energy',
  95: 'CF Industries',
  96: 'Charles River Laboratories',
  97: 'Charles Schwab Corporation',
  98: 'Charter Communications',
  99: 'Chevron Corporation',
  100: 'Chipotle Mexican Grill',
  101: 'Chubb Limited',
  102: 'Church & Dwight',
  103: 'Cigna',
  104: 'Cincinnati Financial',
  105: 'Cintas',
  106: 'Cisco',
  107: 'Citigroup',
  108: 'Citizens Financial Group',
  109: 'Clorox',
  110: 'CME Group',
  111: 'CMS Energy',
  112: 'Coca-Cola Company (The)',
  113: 'Cognizant',
  114: 'Colgate-Palmolive',
  115: 'Comcast',
  116: 'Conagra Brands',
  117: 'ConocoPhillips',
  118: 'Consolidated Edison',
  119: 'Constellation Brands',
  120: 'Constellation Energy',
  121: 'Cooper Companies (The)',
  122: 'Copart',
  123: 'Corning Inc.',
  124: 'Corpay',
  125: 'Corteva',
  126: 'CoStar Group',
  127: 'Costco',
  128: 'Coterra',
  129: 'CrowdStrike',
  130: 'Crown Castle',
  131: 'CSX Corporation',
  132: 'Cummins',
  133: 'CVS Health',
  134: 'Danaher Corporation',
  135: 'Darden Restaurants',
  136: 'DaVita',
  137: 'Dayforce',
  138: 'Deckers Brands',
  139: 'Deere & Company',
  140: 'Dell Technologies',
  141: 'Delta Air Lines',
  142: 'Devon Energy',
  143: 'Dexcom',
  144: 'Diamondback Energy',
  145: 'Digital Realty',
  146: 'Discover Financial',
  147: 'Dollar General',
  148: 'Dollar Tree',
  149: 'Dominion Energy',
  150: "Domino's",
  151: 'DoorDash',
  152: 'Dover Corporation',
  153: 'Dow Inc.',
  154: 'D. R. Horton',
  155: 'DTE Energy',
  156: 'Duke Energy',
  157: 'DuPont',
  158: 'Eastman Chemical Company',
  159: 'Eaton Corporation',
  160: 'eBay Inc.',
  161: 'Ecolab',
  162: 'Edison International',
  163: 'Edwards Lifesciences',
  164: 'Electronic Arts',
  165: 'Elevance Health',
  166: 'Emerson Electric',
  167: 'Enphase Energy',
  168: 'Entergy',
  169: 'EOG Resources',
  170: 'EPAM Systems',
  171: 'EQT Corporation',
  172: 'Equifax',
  173: 'Equinix',
  174: 'Equity Residential',
  175: 'Erie Indemnity',
  176: 'Essex Property Trust',
  177: 'Estée Lauder Companies (The)',
  178: 'Everest Group',
  179: 'Evergy',
  180: 'Eversource Energy',
  181: 'Exelon',
  182: 'Expand Energy',
  183: 'Expedia Group',
  184: 'Expeditors International',
  185: 'Extra Space Storage',
  186: 'ExxonMobil',
  187: 'F5, Inc.',
  188: 'FactSet',
  189: 'Fair Isaac',
  190: 'Fastenal',
  191: 'Federal Realty Investment Trust',
  192: 'FedEx',
  193: 'Fidelity National Information Services',
  194: 'Fifth Third Bancorp',
  195: 'First Solar',
  196: 'FirstEnergy',
  197: 'Fiserv',
  198: 'Ford Motor Company',
  199: 'Fortinet',
  200: 'Fortive',
  201: 'Fox Corporation (Class A)',
  202: 'Fox Corporation (Class B)',
  203: 'Franklin Resources',
  204: 'Freeport-McMoRan',
  205: 'Garmin',
  206: 'Gartner',
  207: 'GE Aerospace',
  208: 'GE HealthCare',
  209: 'GE Vernova',
  210: 'Gen Digital',
  211: 'Generac',
  212: 'General Dynamics',
  213: 'General Mills',
  214: 'General Motors',
  215: 'Genuine Parts Company',
  216: 'Gilead Sciences',
  217: 'Global Payments',
  218: 'Globe Life',
  219: 'GoDaddy',
  220: 'Goldman Sachs',
  221: 'Halliburton',
  222: 'Hartford (The)',
  223: 'Hasbro',
  224: 'HCA Healthcare',
  225: 'Healthpeak Properties',
  226: 'Henry Schein',
  227: 'Hershey Company (The)',
  228: 'Hess Corporation',
  229: 'Hewlett Packard Enterprise',
  230: 'Hilton Worldwide',
  231: 'Hologic',
  232: 'Home Depot (The)',
  233: 'Honeywell',
  234: 'Hormel Foods',
  235: 'Host Hotels & Resorts',
  236: 'Howmet Aerospace',
  237: 'HP Inc.',
  238: 'Hubbell Incorporated',
  239: 'Humana',
  240: 'Huntington Bancshares',
  241: 'Huntington Ingalls Industries',
  242: 'IBM',
  243: 'IDEX Corporation',
  244: 'Idexx Laboratories',
  245: 'Illinois Tool Works',
  246: 'Incyte',
  247: 'Ingersoll Rand',
  248: 'Insulet Corporation',
  249: 'Intel',
  250: 'Intercontinental Exchange',
  251: 'International Flavors & Fragrances',
  252: 'International Paper',
  253: 'Interpublic Group of Companies (The)',
  254: 'Intuit',
  255: 'Intuitive Surgical',
  256: 'Invesco',
  257: 'Invitation Homes',
  258: 'IQVIA',
  259: 'Iron Mountain',
  260: 'J.B. Hunt',
  261: 'Jabil',
  262: 'Jack Henry & Associates',
  263: 'Jacobs Solutions',
  264: 'Johnson & Johnson',
  265: 'Johnson Controls',
  266: 'JPMorgan Chase',
  267: 'Juniper Networks',
  268: 'Kellanova',
  269: 'Kenvue',
  270: 'Keurig Dr Pepper',
  271: 'KeyCorp',
  272: 'Keysight Technologies',
  273: 'Kimberly-Clark',
  274: 'Kimco Realty',
  275: 'Kinder Morgan',
  276: 'KKR & Co.',
  277: 'KLA Corporation',
  278: 'Kraft Heinz',
  279: 'Kroger',
  280: 'L3Harris',
  281: 'Labcorp',
  282: 'Lam Research',
  283: 'Lamb Weston',
  284: 'Las Vegas Sands',
  285: 'Leidos',
  286: 'Lennar',
  287: 'Lennox International',
  288: 'Lilly (Eli)',
  289: 'Linde plc',
  290: 'Live Nation Entertainment',
  291: 'LKQ Corporation',
  292: 'Lockheed Martin',
  293: 'Loews Corporation',
  294: "Lowe's",
  295: 'Lululemon Athletica',
  296: 'LyondellBasell',
  297: 'M&T Bank',
  298: 'Marathon Petroleum',
  299: 'MarketAxess',
  300: 'Marriott International',
  301: 'Marsh McLennan',
  302: 'Martin Marietta Materials',
  303: 'Masco',
  304: 'Mastercard',
  305: 'Match Group',
  306: 'McCormick & Company',
  307: "McDonald's",
  308: 'McKesson Corporation',
  309: 'Medtronic',
  310: 'Merck & Co.',
  311: 'Meta Platforms',
  312: 'MetLife',
  313: 'Mettler Toledo',
  314: 'MGM Resorts',
  315: 'Microchip Technology',
  316: 'Micron Technology',
  317: 'Microsoft',
  318: 'Mid-America Apartment Communities',
  319: 'Moderna',
  320: 'Mohawk Industries',
  321: 'Molina Healthcare',
  322: 'Molson Coors Beverage Company',
  323: 'Mondelez International',
  324: 'Monolithic Power Systems',
  325: 'Monster Beverage',
  326: "Moody's Corporation",
  327: 'Morgan Stanley',
  328: 'Mosaic Company (The)',
  329: 'Motorola Solutions',
  330: 'MSCI Inc.',
  331: 'Nasdaq, Inc.',
  332: 'NetApp',
  333: 'Netflix',
  334: 'Newmont',
  335: 'News Corp (Class A)',
  336: 'News Corp (Class B)',
  337: 'NextEra Energy',
  338: 'Nike, Inc.',
  339: 'NiSource',
  340: 'Nordson Corporation',
  341: 'Norfolk Southern',
  342: 'Northern Trust',
  343: 'Northrop Grumman',
  344: 'Norwegian Cruise Line Holdings',
  345: 'NRG Energy',
  346: 'Nucor',
  347: 'Nvidia',
  348: 'NVR, Inc.',
  349: 'NXP Semiconductors',
  350: 'O’Reilly Automotive',
  351: 'Occidental Petroleum',
  352: 'Old Dominion',
  353: 'Omnicom Group',
  354: 'ON Semiconductor',
  355: 'Oneok',
  356: 'Oracle Corporation',
  357: 'Otis Worldwide',
  358: 'Paccar',
  359: 'Packaging Corporation of America',
  360: 'Palantir Technologies',
  361: 'Palo Alto Networks',
  362: 'Paramount Global',
  363: 'Parker Hannifin',
  364: 'Paychex',
  365: 'Paycom',
  366: 'PayPal',
  367: 'Pentair',
  368: 'PepsiCo',
  369: 'Pfizer',
  370: 'PG&E Corporation',
  371: 'Philip Morris International',
  372: 'Phillips 66',
  373: 'Pinnacle West Capital',
  374: 'PNC Financial Services',
  375: 'Pool Corporation',
  376: 'PPG Industries',
  377: 'PPL Corporation',
  378: 'Principal Financial Group',
  379: 'Procter & Gamble',
  380: 'Progressive Corporation',
  381: 'Prologis',
  382: 'Prudential Financial',
  383: 'Public Service Enterprise Group',
  384: 'PTC Inc.',
  385: 'Public Storage',
  386: 'PulteGroup',
  387: 'Quanta Services',
  388: 'Qualcomm',
  389: 'Quest Diagnostics',
  390: 'Ralph Lauren Corporation',
  391: 'Raymond James Financial',
  392: 'RTX Corporation',
  393: 'Realty Income',
  394: 'Regency Centers',
  395: 'Regeneron Pharmaceuticals',
  396: 'Regions Financial Corporation',
  397: 'Republic Services',
  398: 'ResMed',
  399: 'Revvity',
  400: 'Rockwell Automation',
  401: 'Rollins, Inc.',
  402: 'Roper Technologies',
  403: 'Ross Stores',
  404: 'Royal Caribbean Group',
  405: 'S&P Global',
  406: 'Salesforce',
  407: 'SBA Communications',
  408: 'Schlumberger',
  409: 'Seagate Technology',
  410: 'Sempra',
  411: 'ServiceNow',
  412: 'Sherwin-Williams',
  413: 'Simon Property Group',
  414: 'Skyworks Solutions',
  415: 'J.M. Smucker Company (The)',
  416: 'Smurfit Westrock',
  417: 'Snap-on',
  418: 'Solventum',
  419: 'Southern Company',
  420: 'Southwest Airlines',
  421: 'Stanley Black & Decker',
  422: 'Starbucks',
  423: 'State Street Corporation',
  424: 'Steel Dynamics',
  425: 'Steris',
  426: 'Stryker Corporation',
  427: 'Supermicro',
  428: 'Synchrony Financial',
  429: 'Synopsys',
  430: 'Sysco',
  431: 'T-Mobile US',
  432: 'T. Rowe Price',
  433: 'Take-Two Interactive',
  434: 'Tapestry, Inc.',
  435: 'Targa Resources',
  436: 'Target Corporation',
  437: 'TE Connectivity',
  438: 'Teledyne Technologies',
  439: 'Teradyne',
  440: 'Tesla, Inc.',
  441: 'Texas Instruments',
  442: 'Texas Pacific Land Corporation',
  443: 'Textron',
  444: 'Thermo Fisher Scientific',
  445: 'TJX Companies',
  446: 'TKO Group Holdings',
  447: 'Tractor Supply',
  448: 'Trane Technologies',
  449: 'TransDigm Group',
  450: 'Travelers Companies (The)',
  451: 'Trimble Inc.',
  452: 'Truist Financial',
  453: 'Tyler Technologies',
  454: 'Tyson Foods',
  455: 'U.S. Bancorp',
  456: 'Uber',
  457: 'UDR, Inc.',
  458: 'Ulta Beauty',
  459: 'Union Pacific Corporation',
  460: 'United Airlines Holdings',
  461: 'United Parcel Service',
  462: 'United Rentals',
  463: 'UnitedHealth Group',
  464: 'Universal Health Services',
  465: 'Valero Energy',
  466: 'Ventas',
  467: 'Veralto',
  468: 'Verisign',
  469: 'Verisk Analytics',
  470: 'Verizon',
  471: 'Vertex Pharmaceuticals',
  472: 'Viatris',
  473: 'Vici Properties',
  474: 'Visa Inc.',
  475: 'Vistra Corp.',
  476: 'Vulcan Materials Company',
  477: 'W. R. Berkley Corporation',
  478: 'W. W. Grainger',
  479: 'Wabtec',
  480: 'Walgreens Boots Alliance',
  481: 'Walmart',
  482: 'Walt Disney Company (The)',
  483: 'Warner Bros. Discovery',
  484: 'Waste Management',
  485: 'Waters Corporation',
  486: 'WEC Energy Group',
  487: 'Wells Fargo',
  488: 'Welltower',
  489: 'West Pharmaceutical Services',
  490: 'Western Digital',
  491: 'Weyerhaeuser',
  492: 'Williams-Sonoma, Inc.',
  493: 'Williams Companies',
  494: 'Willis Towers Watson',
  495: 'Workday, Inc.',
  496: 'Wynn Resorts',
  497: 'Xcel Energy',
  498: 'Xylem Inc.',
  499: 'Yum! Brands',
  500: 'Zebra Technologies',
  501: 'Zimmer Biomet',
  502: 'Zoetis',
  503: 'HSBC Holdings plc',
  504: 'Taiwan Semiconductor Manufacturing Company Limited'},
 'GICS Sector': {0: 'Industrials',
  1: 'Industrials',
  2: 'Health Care',
  3: 'Health Care',
  4: 'Information Technology',
  5: 'Information Technology',
  6: 'Information Technology',
  7: 'Utilities',
  8: 'Financials',
  9: 'Health Care',
  10: 'Materials',
  11: 'Consumer Discretionary',
  12: 'Information Technology',
  13: 'Materials',
  14: 'Real Estate',
  15: 'Health Care',
  16: 'Industrials',
  17: 'Utilities',
  18: 'Financials',
  19: 'Communication Services',
  20: 'Communication Services',
  21: 'Consumer Staples',
  22: 'Consumer Discretionary',
  23: 'Materials',
  24: 'Utilities',
  25: 'Utilities',
  26: 'Financials',
  27: 'Financials',
  28: 'Real Estate',
  29: 'Utilities',
  30: 'Financials',
  31: 'Industrials',
  32: 'Health Care',
  33: 'Information Technology',
  34: 'Information Technology',
  35: 'Information Technology',
  36: 'Financials',
  37: 'Energy',
  38: 'Financials',
  39: 'Information Technology',
  40: 'Information Technology',
  41: 'Consumer Discretionary',
  42: 'Financials',
  43: 'Consumer Staples',
  44: 'Information Technology',
  45: 'Financials',
  46: 'Financials',
  47: 'Communication Services',
  48: 'Utilities',
  49: 'Information Technology',
  50: 'Industrials',
  51: 'Consumer Discretionary',
  52: 'Real Estate',
  53: 'Materials',
  54: 'Industrials',
  55: 'Energy',
  56: 'Materials',
  57: 'Financials',
  58: 'Health Care',
  59: 'Health Care',
  60: 'Financials',
  61: 'Consumer Discretionary',
  62: 'Health Care',
  63: 'Health Care',
  64: 'Financials',
  65: 'Financials',
  66: 'Financials',
  67: 'Industrials',
  68: 'Consumer Discretionary',
  69: 'Health Care',
  70: 'Health Care',
  71: 'Information Technology',
  72: 'Industrials',
  73: 'Financials',
  74: 'Consumer Staples',
  75: 'Industrials',
  76: 'Consumer Staples',
  77: 'Real Estate',
  78: 'Industrials',
  79: 'Information Technology',
  80: 'Consumer Discretionary',
  81: 'Real Estate',
  82: 'Consumer Staples',
  83: 'Financials',
  84: 'Health Care',
  85: 'Consumer Discretionary',
  86: 'Consumer Discretionary',
  87: 'Industrials',
  88: 'Industrials',
  89: 'Financials',
  90: 'Real Estate',
  91: 'Information Technology',
  92: 'Health Care',
  93: 'Health Care',
  94: 'Utilities',
  95: 'Materials',
  96: 'Health Care',
  97: 'Financials',
  98: 'Communication Services',
  99: 'Energy',
  100: 'Consumer Discretionary',
  101: 'Financials',
  102: 'Consumer Staples',
  103: 'Health Care',
  104: 'Financials',
  105: 'Industrials',
  106: 'Information Technology',
  107: 'Financials',
  108: 'Financials',
  109: 'Consumer Staples',
  110: 'Financials',
  111: 'Utilities',
  112: 'Consumer Staples',
  113: 'Information Technology',
  114: 'Consumer Staples',
  115: 'Communication Services',
  116: 'Consumer Staples',
  117: 'Energy',
  118: 'Utilities',
  119: 'Consumer Staples',
  120: 'Utilities',
  121: 'Health Care',
  122: 'Industrials',
  123: 'Information Technology',
  124: 'Financials',
  125: 'Materials',
  126: 'Real Estate',
  127: 'Consumer Staples',
  128: 'Energy',
  129: 'Information Technology',
  130: 'Real Estate',
  131: 'Industrials',
  132: 'Industrials',
  133: 'Health Care',
  134: 'Health Care',
  135: 'Consumer Discretionary',
  136: 'Health Care',
  137: 'Industrials',
  138: 'Consumer Discretionary',
  139: 'Industrials',
  140: 'Information Technology',
  141: 'Industrials',
  142: 'Energy',
  143: 'Health Care',
  144: 'Energy',
  145: 'Real Estate',
  146: 'Financials',
  147: 'Consumer Staples',
  148: 'Consumer Staples',
  149: 'Utilities',
  150: 'Consumer Discretionary',
  151: 'Consumer Discretionary',
  152: 'Industrials',
  153: 'Materials',
  154: 'Consumer Discretionary',
  155: 'Utilities',
  156: 'Utilities',
  157: 'Materials',
  158: 'Materials',
  159: 'Industrials',
  160: 'Consumer Discretionary',
  161: 'Materials',
  162: 'Utilities',
  163: 'Health Care',
  164: 'Communication Services',
  165: 'Health Care',
  166: 'Industrials',
  167: 'Information Technology',
  168: 'Utilities',
  169: 'Energy',
  170: 'Information Technology',
  171: 'Energy',
  172: 'Industrials',
  173: 'Real Estate',
  174: 'Real Estate',
  175: 'Financials',
  176: 'Real Estate',
  177: 'Consumer Staples',
  178: 'Financials',
  179: 'Utilities',
  180: 'Utilities',
  181: 'Utilities',
  182: 'Energy',
  183: 'Consumer Discretionary',
  184: 'Industrials',
  185: 'Real Estate',
  186: 'Energy',
  187: 'Information Technology',
  188: 'Financials',
  189: 'Information Technology',
  190: 'Industrials',
  191: 'Real Estate',
  192: 'Industrials',
  193: 'Financials',
  194: 'Financials',
  195: 'Information Technology',
  196: 'Utilities',
  197: 'Financials',
  198: 'Consumer Discretionary',
  199: 'Information Technology',
  200: 'Industrials',
  201: 'Communication Services',
  202: 'Communication Services',
  203: 'Financials',
  204: 'Materials',
  205: 'Consumer Discretionary',
  206: 'Information Technology',
  207: 'Industrials',
  208: 'Health Care',
  209: 'Industrials',
  210: 'Information Technology',
  211: 'Industrials',
  212: 'Industrials',
  213: 'Consumer Staples',
  214: 'Consumer Discretionary',
  215: 'Consumer Discretionary',
  216: 'Health Care',
  217: 'Financials',
  218: 'Financials',
  219: 'Information Technology',
  220: 'Financials',
  221: 'Energy',
  222: 'Financials',
  223: 'Consumer Discretionary',
  224: 'Health Care',
  225: 'Real Estate',
  226: 'Health Care',
  227: 'Consumer Staples',
  228: 'Energy',
  229: 'Information Technology',
  230: 'Consumer Discretionary',
  231: 'Health Care',
  232: 'Consumer Discretionary',
  233: 'Industrials',
  234: 'Consumer Staples',
  235: 'Real Estate',
  236: 'Industrials',
  237: 'Information Technology',
  238: 'Industrials',
  239: 'Health Care',
  240: 'Financials',
  241: 'Industrials',
  242: 'Information Technology',
  243: 'Industrials',
  244: 'Health Care',
  245: 'Industrials',
  246: 'Health Care',
  247: 'Industrials',
  248: 'Health Care',
  249: 'Information Technology',
  250: 'Financials',
  251: 'Materials',
  252: 'Materials',
  253: 'Communication Services',
  254: 'Information Technology',
  255: 'Health Care',
  256: 'Financials',
  257: 'Real Estate',
  258: 'Health Care',
  259: 'Real Estate',
  260: 'Industrials',
  261: 'Information Technology',
  262: 'Financials',
  263: 'Industrials',
  264: 'Health Care',
  265: 'Industrials',
  266: 'Financials',
  267: 'Information Technology',
  268: 'Consumer Staples',
  269: 'Consumer Staples',
  270: 'Consumer Staples',
  271: 'Financials',
  272: 'Information Technology',
  273: 'Consumer Staples',
  274: 'Real Estate',
  275: 'Energy',
  276: 'Financials',
  277: 'Information Technology',
  278: 'Consumer Staples',
  279: 'Consumer Staples',
  280: 'Industrials',
  281: 'Health Care',
  282: 'Information Technology',
  283: 'Consumer Staples',
  284: 'Consumer Discretionary',
  285: 'Industrials',
  286: 'Consumer Discretionary',
  287: 'Industrials',
  288: 'Health Care',
  289: 'Materials',
  290: 'Communication Services',
  291: 'Consumer Discretionary',
  292: 'Industrials',
  293: 'Financials',
  294: 'Consumer Discretionary',
  295: 'Consumer Discretionary',
  296: 'Materials',
  297: 'Financials',
  298: 'Energy',
  299: 'Financials',
  300: 'Consumer Discretionary',
  301: 'Financials',
  302: 'Materials',
  303: 'Industrials',
  304: 'Financials',
  305: 'Communication Services',
  306: 'Consumer Staples',
  307: 'Consumer Discretionary',
  308: 'Health Care',
  309: 'Health Care',
  310: 'Health Care',
  311: 'Communication Services',
  312: 'Financials',
  313: 'Health Care',
  314: 'Consumer Discretionary',
  315: 'Information Technology',
  316: 'Information Technology',
  317: 'Information Technology',
  318: 'Real Estate',
  319: 'Health Care',
  320: 'Consumer Discretionary',
  321: 'Health Care',
  322: 'Consumer Staples',
  323: 'Consumer Staples',
  324: 'Information Technology',
  325: 'Consumer Staples',
  326: 'Financials',
  327: 'Financials',
  328: 'Materials',
  329: 'Information Technology',
  330: 'Financials',
  331: 'Financials',
  332: 'Information Technology',
  333: 'Communication Services',
  334: 'Materials',
  335: 'Communication Services',
  336: 'Communication Services',
  337: 'Utilities',
  338: 'Consumer Discretionary',
  339: 'Utilities',
  340: 'Industrials',
  341: 'Industrials',
  342: 'Financials',
  343: 'Industrials',
  344: 'Consumer Discretionary',
  345: 'Utilities',
  346: 'Materials',
  347: 'Information Technology',
  348: 'Consumer Discretionary',
  349: 'Information Technology',
  350: 'Consumer Discretionary',
  351: 'Energy',
  352: 'Industrials',
  353: 'Communication Services',
  354: 'Information Technology',
  355: 'Energy',
  356: 'Information Technology',
  357: 'Industrials',
  358: 'Industrials',
  359: 'Materials',
  360: 'Information Technology',
  361: 'Information Technology',
  362: 'Communication Services',
  363: 'Industrials',
  364: 'Industrials',
  365: 'Industrials',
  366: 'Financials',
  367: 'Industrials',
  368: 'Consumer Staples',
  369: 'Health Care',
  370: 'Utilities',
  371: 'Consumer Staples',
  372: 'Energy',
  373: 'Utilities',
  374: 'Financials',
  375: 'Consumer Discretionary',
  376: 'Materials',
  377: 'Utilities',
  378: 'Financials',
  379: 'Consumer Staples',
  380: 'Financials',
  381: 'Real Estate',
  382: 'Financials',
  383: 'Utilities',
  384: 'Information Technology',
  385: 'Real Estate',
  386: 'Consumer Discretionary',
  387: 'Industrials',
  388: 'Information Technology',
  389: 'Health Care',
  390: 'Consumer Discretionary',
  391: 'Financials',
  392: 'Industrials',
  393: 'Real Estate',
  394: 'Real Estate',
  395: 'Health Care',
  396: 'Financials',
  397: 'Industrials',
  398: 'Health Care',
  399: 'Health Care',
  400: 'Industrials',
  401: 'Industrials',
  402: 'Information Technology',
  403: 'Consumer Discretionary',
  404: 'Consumer Discretionary',
  405: 'Financials',
  406: 'Information Technology',
  407: 'Real Estate',
  408: 'Energy',
  409: 'Information Technology',
  410: 'Utilities',
  411: 'Information Technology',
  412: 'Materials',
  413: 'Real Estate',
  414: 'Information Technology',
  415: 'Consumer Staples',
  416: 'Materials',
  417: 'Industrials',
  418: 'Health Care',
  419: 'Utilities',
  420: 'Industrials',
  421: 'Industrials',
  422: 'Consumer Discretionary',
  423: 'Financials',
  424: 'Materials',
  425: 'Health Care',
  426: 'Health Care',
  427: 'Information Technology',
  428: 'Financials',
  429: 'Information Technology',
  430: 'Consumer Staples',
  431: 'Communication Services',
  432: 'Financials',
  433: 'Communication Services',
  434: 'Consumer Discretionary',
  435: 'Energy',
  436: 'Consumer Staples',
  437: 'Information Technology',
  438: 'Information Technology',
  439: 'Information Technology',
  440: 'Consumer Discretionary',
  441: 'Information Technology',
  442: 'Energy',
  443: 'Industrials',
  444: 'Health Care',
  445: 'Consumer Discretionary',
  446: 'Communication Services',
  447: 'Consumer Discretionary',
  448: 'Industrials',
  449: 'Industrials',
  450: 'Financials',
  451: 'Information Technology',
  452: 'Financials',
  453: 'Information Technology',
  454: 'Consumer Staples',
  455: 'Financials',
  456: 'Industrials',
  457: 'Real Estate',
  458: 'Consumer Discretionary',
  459: 'Industrials',
  460: 'Industrials',
  461: 'Industrials',
  462: 'Industrials',
  463: 'Health Care',
  464: 'Health Care',
  465: 'Energy',
  466: 'Real Estate',
  467: 'Industrials',
  468: 'Information Technology',
  469: 'Industrials',
  470: 'Communication Services',
  471: 'Health Care',
  472: 'Health Care',
  473: 'Real Estate',
  474: 'Financials',
  475: 'Utilities',
  476: 'Materials',
  477: 'Financials',
  478: 'Industrials',
  479: 'Industrials',
  480: 'Consumer Staples',
  481: 'Consumer Staples',
  482: 'Communication Services',
  483: 'Communication Services',
  484: 'Industrials',
  485: 'Health Care',
  486: 'Utilities',
  487: 'Financials',
  488: 'Real Estate',
  489: 'Health Care',
  490: 'Information Technology',
  491: 'Real Estate',
  492: 'Consumer Discretionary',
  493: 'Energy',
  494: 'Financials',
  495: 'Information Technology',
  496: 'Consumer Discretionary',
  497: 'Utilities',
  498: 'Industrials',
  499: 'Consumer Discretionary',
  500: 'Information Technology',
  501: 'Health Care',
  502: 'Health Care',
  503: 'Financials',
  504: 'Information Technology'}}

sp500_plus2 = pd.DataFrame.from_dict(sp500_plus2_dict)

SECTOR_KEYWORDS = {
    "Information Technology": ["tech", "software", "hardware", "AI", "cloud", "computers", "IT", "semiconductor"],
    "Health Care": ["hospital", "vaccine", "pharma", "biotech", "medical", "health", "clinical", "treatment"],
    "Financials": ["bank", "insurance", "credit", "loan", "fintech", "capital", "asset management"],
    "Energy": ["oil", "gas", "energy", "renewables", "power", "fuel", "electricity"],
    "Industrials": ["manufacturing", "engineering", "industrial", "machinery", "logistics", "aerospace"],
    "Consumer Discretionary": ["retail", "e-commerce", "automotive", "fashion", "leisure", "luxury", "travel"],
    "Consumer Staples": ["grocery", "food", "beverage", "personal care", "household", "toiletries"],
    "Utilities": ["electric", "water", "natural gas", "grid", "utility", "infrastructure"],
    "Real Estate": ["REIT", "real estate", "housing", "property", "mortgage", "commercial space"],
    "Materials": ["mining", "chemical", "raw material", "metal", "cement", "steel", "paper"],
    "Communication Services": ["media", "telecom", "streaming", "internet", "advertising", "social media"],
}

country_to_region = {'Afghanistan': 'South Asia',
 'Albania': 'Europe & Central Asia',
 'Algeria': 'Middle East & North Africa',
 'American Samoa': 'East Asia & Pacific',
 'Andorra': 'Europe & Central Asia',
 'Angola': 'Sub-Saharan Africa',
 'Antigua and Barbuda': 'Latin America & Caribbean',
 'Argentina': 'Latin America & Caribbean',
 'Armenia': 'Europe & Central Asia',
 'Aruba': 'Latin America & Caribbean',
 'Australia': 'East Asia & Pacific',
 'Austria': 'Europe & Central Asia',
 'Azerbaijan': 'Europe & Central Asia',
 'Bahamas, The': 'Latin America & Caribbean',
 'Bahrain': 'Middle East & North Africa',
 'Bangladesh': 'South Asia',
 'Barbados': 'Latin America & Caribbean',
 'Belarus': 'Europe & Central Asia',
 'Belgium': 'Europe & Central Asia',
 'Belize': 'Latin America & Caribbean',
 'Benin': 'Sub-Saharan Africa',
 'Bermuda': 'North America',
 'Bhutan': 'South Asia',
 'Bolivia': 'Latin America & Caribbean',
 'Bosnia and Herzegovina': 'Europe & Central Asia',
 'Botswana': 'Sub-Saharan Africa',
 'Brazil': 'Latin America & Caribbean',
 'British Virgin Islands': 'Latin America & Caribbean',
 'Brunei Darussalam': 'East Asia & Pacific',
 'Bulgaria': 'Europe & Central Asia',
 'Burkina Faso': 'Sub-Saharan Africa',
 'Burundi': 'Sub-Saharan Africa',
 'Cabo Verde': 'Sub-Saharan Africa',
 'Cambodia': 'East Asia & Pacific',
 'Cameroon': 'Sub-Saharan Africa',
 'Canada': 'North America',
 'Cayman Islands': 'Latin America & Caribbean',
 'Central African Republic': 'Sub-Saharan Africa',
 'Chad': 'Sub-Saharan Africa',
 'Channel Islands': 'Europe & Central Asia',
 'Chile': 'Latin America & Caribbean',
 'China': 'East Asia & Pacific',
 'Colombia': 'Latin America & Caribbean',
 'Comoros': 'Sub-Saharan Africa',
 'Congo, Dem. Rep.': 'Sub-Saharan Africa',
 'Congo, Rep.': 'Sub-Saharan Africa',
 'Costa Rica': 'Latin America & Caribbean',
 'Côte d’Ivoire': 'Sub-Saharan Africa',
 'Croatia': 'Europe & Central Asia',
 'Cuba': 'Latin America & Caribbean',
 'Curaçao': 'Latin America & Caribbean',
 'Cyprus': 'Europe & Central Asia',
 'Czechia': 'Europe & Central Asia',
 'Denmark': 'Europe & Central Asia',
 'Djibouti': 'Middle East & North Africa',
 'Dominica': 'Latin America & Caribbean',
 'Dominican Republic': 'Latin America & Caribbean',
 'Ecuador': 'Latin America & Caribbean',
 'Egypt, Arab Rep.': 'Middle East & North Africa',
 'El Salvador': 'Latin America & Caribbean',
 'Equatorial Guinea': 'Sub-Saharan Africa',
 'Eritrea': 'Sub-Saharan Africa',
 'Estonia': 'Europe & Central Asia',
 'Eswatini': 'Sub-Saharan Africa',
 'Ethiopia': 'Sub-Saharan Africa',
 'Faroe Islands': 'Europe & Central Asia',
 'Fiji': 'East Asia & Pacific',
 'Finland': 'Europe & Central Asia',
 'France': 'Europe & Central Asia',
 'French Polynesia': 'East Asia & Pacific',
 'Gabon': 'Sub-Saharan Africa',
 'Gambia, The': 'Sub-Saharan Africa',
 'Georgia': 'Europe & Central Asia',
 'Germany': 'Europe & Central Asia',
 'Ghana': 'Sub-Saharan Africa',
 'Gibraltar': 'Europe & Central Asia',
 'Greece': 'Europe & Central Asia',
 'Greenland': 'Europe & Central Asia',
 'Grenada': 'Latin America & Caribbean',
 'Guam': 'East Asia & Pacific',
 'Guatemala': 'Latin America & Caribbean',
 'Guinea': 'Sub-Saharan Africa',
 'Guinea-Bissau': 'Sub-Saharan Africa',
 'Guyana': 'Latin America & Caribbean',
 'Haiti': 'Latin America & Caribbean',
 'Honduras': 'Latin America & Caribbean',
 'Hong Kong SAR, China': 'East Asia & Pacific',
 'Hungary': 'Europe & Central Asia',
 'Iceland': 'Europe & Central Asia',
 'India': 'South Asia',
 'Indonesia': 'East Asia & Pacific',
 'Iran, Islamic Rep.': 'Middle East & North Africa',
 'Iraq': 'Middle East & North Africa',
 'Ireland': 'Europe & Central Asia',
 'Isle of Man': 'Europe & Central Asia',
 'Israel': 'Middle East & North Africa',
 'Italy': 'Europe & Central Asia',
 'Jamaica': 'Latin America & Caribbean',
 'Japan': 'East Asia & Pacific',
 'Jordan': 'Middle East & North Africa',
 'Kazakhstan': 'Europe & Central Asia',
 'Kenya': 'Sub-Saharan Africa',
 'Kiribati': 'East Asia & Pacific',
 "Korea, Dem. People's Rep.": 'East Asia & Pacific',
 'Korea, Rep.': 'East Asia & Pacific',
 'Kosovo': 'Europe & Central Asia',
 'Kuwait': 'Middle East & North Africa',
 'Kyrgyz Republic': 'Europe & Central Asia',
 'Lao PDR': 'East Asia & Pacific',
 'Latvia': 'Europe & Central Asia',
 'Lebanon': 'Middle East & North Africa',
 'Lesotho': 'Sub-Saharan Africa',
 'Liberia': 'Sub-Saharan Africa',
 'Libya': 'Middle East & North Africa',
 'Liechtenstein': 'Europe & Central Asia',
 'Lithuania': 'Europe & Central Asia',
 'Luxembourg': 'Europe & Central Asia',
 'Macao SAR, China': 'East Asia & Pacific',
 'Madagascar': 'Sub-Saharan Africa',
 'Malawi': 'Sub-Saharan Africa',
 'Malaysia': 'East Asia & Pacific',
 'Maldives': 'South Asia',
 'Mali': 'Sub-Saharan Africa',
 'Malta': 'Middle East & North Africa',
 'Marshall Islands': 'East Asia & Pacific',
 'Mauritania': 'Sub-Saharan Africa',
 'Mauritius': 'Sub-Saharan Africa',
 'Mexico': 'Latin America & Caribbean',
 'Micronesia, Fed. Sts.': 'East Asia & Pacific',
 'Moldova': 'Europe & Central Asia',
 'Monaco': 'Europe & Central Asia',
 'Mongolia': 'East Asia & Pacific',
 'Montenegro': 'Europe & Central Asia',
 'Morocco': 'Middle East & North Africa',
 'Mozambique': 'Sub-Saharan Africa',
 'Myanmar': 'East Asia & Pacific',
 'Namibia': 'Sub-Saharan Africa',
 'Nauru': 'East Asia & Pacific',
 'Nepal': 'South Asia',
 'Netherlands': 'Europe & Central Asia',
 'New Caledonia': 'East Asia & Pacific',
 'New Zealand': 'East Asia & Pacific',
 'Nicaragua': 'Latin America & Caribbean',
 'Niger': 'Sub-Saharan Africa',
 'Nigeria': 'Sub-Saharan Africa',
 'North Macedonia': 'Europe & Central Asia',
 'Northern Mariana Islands': 'East Asia & Pacific',
 'Norway': 'Europe & Central Asia',
 'Oman': 'Middle East & North Africa',
 'Pakistan': 'South Asia',
 'Palau': 'East Asia & Pacific',
 'Panama': 'Latin America & Caribbean',
 'Papua New Guinea': 'East Asia & Pacific',
 'Paraguay': 'Latin America & Caribbean',
 'Peru': 'Latin America & Caribbean',
 'Philippines': 'East Asia & Pacific',
 'Poland': 'Europe & Central Asia',
 'Portugal': 'Europe & Central Asia',
 'Puerto Rico': 'Latin America & Caribbean',
 'Qatar': 'Middle East & North Africa',
 'Romania': 'Europe & Central Asia',
 'Russian Federation': 'Europe & Central Asia',
 'Rwanda': 'Sub-Saharan Africa',
 'Samoa': 'East Asia & Pacific',
 'San Marino': 'Europe & Central Asia',
 'São Tomé and Príncipe': 'Sub-Saharan Africa',
 'Saudi Arabia': 'Middle East & North Africa',
 'Senegal': 'Sub-Saharan Africa',
 'Serbia': 'Europe & Central Asia',
 'Seychelles': 'Sub-Saharan Africa',
 'Sierra Leone': 'Sub-Saharan Africa',
 'Singapore': 'East Asia & Pacific',
 'Sint Maarten (Dutch part)': 'Latin America & Caribbean',
 'Slovak Republic': 'Europe & Central Asia',
 'Slovenia': 'Europe & Central Asia',
 'Solomon Islands': 'East Asia & Pacific',
 'Somalia': 'Sub-Saharan Africa',
 'South Africa': 'Sub-Saharan Africa',
 'South Sudan': 'Sub-Saharan Africa',
 'Spain': 'Europe & Central Asia',
 'Sri Lanka': 'South Asia',
 'St. Kitts and Nevis': 'Latin America & Caribbean',
 'St. Lucia': 'Latin America & Caribbean',
 'St. Martin (French part)': 'Latin America & Caribbean',
 'St. Vincent and the Grenadines': 'Latin America & Caribbean',
 'Sudan': 'Sub-Saharan Africa',
 'Suriname': 'Latin America & Caribbean',
 'Sweden': 'Europe & Central Asia',
 'Switzerland': 'Europe & Central Asia',
 'Syrian Arab Republic': 'Middle East & North Africa',
 'Taiwan, China': 'East Asia & Pacific',
 'Tajikistan': 'Europe & Central Asia',
 'Tanzania': 'Sub-Saharan Africa',
 'Thailand': 'East Asia & Pacific',
 'Timor-Leste': 'East Asia & Pacific',
 'Togo': 'Sub-Saharan Africa',
 'Tonga': 'East Asia & Pacific',
 'Trinidad and Tobago': 'Latin America & Caribbean',
 'Tunisia': 'Middle East & North Africa',
 'Türkiye': 'Europe & Central Asia',
 'Turkmenistan': 'Europe & Central Asia',
 'Turks and Caicos Islands': 'Latin America & Caribbean',
 'Tuvalu': 'East Asia & Pacific',
 'Uganda': 'Sub-Saharan Africa',
 'Ukraine': 'Europe & Central Asia',
 'United Arab Emirates': 'Middle East & North Africa',
 'United Kingdom': 'Europe & Central Asia',
 'United States': 'North America',
 'U.S.': 'North America',
 'Uruguay': 'Latin America & Caribbean',
 'Uzbekistan': 'Europe & Central Asia',
 'Vanuatu': 'East Asia & Pacific',
 'Venezuela, RB': 'Latin America & Caribbean',
 'Vietnam': 'East Asia & Pacific',
 'Virgin Islands': 'Latin America & Caribbean',
 'West Bank and Gaza': 'Middle East & North Africa',
 'Yemen, Rep.': 'Middle East & North Africa',
 'Zambia': 'Sub-Saharan Africa',
 'Zimbabwe': 'Sub-Saharan Africa',
 'South Asia': 'South Asia',
 'Europe & Central Asia': 'Europe & Central Asia',
 'Middle East & North Africa': 'Middle East & North Africa',
 'East Asia & Pacific': 'East Asia & Pacific',
 'Sub-Saharan Africa': 'Sub-Saharan Africa',
 'Latin America & Caribbean': 'Latin America & Caribbean',
 'North America': 'North America'}

regions = [
    'South Asia', 'Europe & Central Asia', 'Middle East & North Africa',
    'East Asia & Pacific', 'Sub-Saharan Africa', 'Latin America & Caribbean',
    'North America'
]

# Add to the dictionary
for region in regions:
    country_to_region[region] = region

subprocess.run(["python3", "-m", "spacy", "download", "en_core_web_trf"])
nlp = spacy.load("en_core_web_trf")

# Get S&P 500 tickers from Wikipedia
# url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
# tables = pd.read_html(url)
# sp500_df = tables[0]

# Get only the necessary columns
# sp500_plus2 = sp500_df[["Security", "GICS Sector"]]

# Define new rows as DataFrames
#new_row_1 = pd.DataFrame([{"Security": "HSBC Holdings plc", "GICS Sector": "Financials"}])
#new_row_2 = pd.DataFrame([{"Security": "Taiwan Semiconductor Manufacturing Company Limited", "GICS Sector": "Information Technology"}])

# Concatenate the new rows
#sp500_plus2 = pd.concat([sp500_plus2, new_row_1, new_row_2], ignore_index=True)

# Create list of known companies
known_companies = sp500_plus2["Security"].tolist()

# Create list of unique GICS sectors
sectors = sp500_plus2["GICS Sector"].unique().tolist()

# ** General-purpose helper functions for common tasks like formatting responses or handling dates.

def format_response(data, message="Success", status_code=200):
    return jsonify({
        "status": status_code,
        "message": message,
        "data": data
    }), status_code

def calculate_percentage(part, whole):
    if whole == 0:
        return 0
    return (part / whole) * 100

def password_rule_checker(password):
    # Check if password is at least 8 characters long
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    # Check if password has at least one uppercase letter
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    # Check if password has at least one lowercase letter
    if not any(char.islower() for char in password):
        return False, "Password must contain at least one lowercase letter"
    # Check if password has at least one digit
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    # Check if password has at least one special character
    if not any(char in "!@#$%^&*()-_=+[]{}|;:,.<>?/~" for char in password):
        return False, "Password must contain at least one special character"
    return True, "Password meets all requirements"


def format_date_into_tuple_for_gnews(date):
    date = date.split("-")
    return (int(date[0]), int(date[1]), int(date[2]))

def URL_decoder(url):
    # Decode the URL
    try: 
        decoded_url = new_decoderv1(url)
        if decoded_url.get("status"):
            return decoded_url
        else:
            print("Error:", decoded_url["message"])
    except Exception as e:
        print(f"Error occurred: {e}")

def get_article_details(url, article_html):
    from app.services.sentiment_analysis import get_sentiment  # Move import here to avoid circular import
    try:
        time.sleep(10)
        # Fetch the article details
        article_result = article(url, input_html=article_html)
        article_result.nlp()

        # Summarise the article text
        interpreted_news = news_interpreter(article_result.text, 100)

        # extract the metadata from the interpreted news
        metadata = interpreted_news.get("metadata", {})
        companies = metadata.get("companies", [])
        regions = metadata.get("regions", [])
        sectors = metadata.get("sectors", [])

        # Extract the summary from the interpreted news
        summary = interpreted_news.get("summary", "No summary available")
        if not summary:
            summary = article_result.summary

        # get the sentiment of the article
        sentiment = get_sentiment(article_result.title + summary, False)

        keyword = article_result.keywords
    
        return {
            "text": article_result.text,
            "summary": summary,
            'numerical_score': sentiment['numerical_score'],
            'finbert_score': sentiment['finbert_score'],
            'second_model_score': sentiment['second_model_score'],
            'classification': sentiment['classification'],
            'confidence': sentiment['confidence'],
            'agreement_rate': sentiment['agreement_rate'],
            'keywords': keyword,
            'companies': companies,
            'regions': regions,
            'sectors': sectors,
        }

    except Exception as e:
        print(f"An error occurred: {e}")
        return {
            "text": "An error occurred while fetching the article details",
            "summary": "An error occurred while fetching the article details",
            'numerical_score': 0,
            'finbert_score': 0,
            'second_model_score': 0,
            'classification': "neutral",
            'confidence': 0,
            'agreement_rate': 0,
            'keywords': [],
            'companies': [],
            'regions': [],
            'sectors': [],
        }


def news_interpreter_summariser(news_text, summary_length):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("API key not found. Please set the GEMINI_API_KEY in the .env file.")

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
        Summarize the article in {summary_length} words or less.

        {news_text}
    """

    response = model.generate_content(prompt)

    # Check if we have a valid response
    if not response or not response.candidates or not response.candidates[0].content.parts:
        print("Error: No valid response received from the model")
        return None
    
    # Process the response
    news_summary = response.candidates[0].content.parts[0].text
    
    # Clean the text of any markdown or extra formatting
    clean_text = re.sub(r'```json\s*|\s*```$', '', news_summary)
    clean_text = clean_text.strip()

    # clean_text = "Hello world"
    return clean_text

### NEWS_INTERPRETER_TAGGER FUNCTIONS START HERE ###

def extract_info_from_article(article):
    prompt = f"""
    Based on the following article, write very briefly about the companies, regions and sectors involved. Your goal is to clearly and naturally mention:
    Company names involved, using their full security names (e.g. Taiwan Semiconductor Manufacturing Company Limited, not TSM).
    Countries or regions involved, using their full country name (e.g. United States) or World Bank region (i.e. 'South Asia', 'Europe & Central Asia', 'Middle East & North Africa', 'East Asia & Pacific', 'Sub-Saharan Africa', 'Latin America & Caribbean', 'North America').
    Relevant business sectors using their full GICS sector names (i.e. 'Industrials', 'Health Care', 'Information Technology', 'Utilities', 'Financials', 'Materials', 'Consumer Discretionary', 'Real Estate', 'Communication Services', 'Consumer Staples', 'Energy').
    In the event an article does not involve any companies or regions or sectors, then you need not write about that category. Avoid using bullet points or abbreviations. Make sure the summary sounds natural and uses full sentences.
    Here is the article:

    {article}
    """
    # try:
    #     response = requests.post(
    #         "http://localhost:11434/api/generate",
    #         json={"model": "llama3.2", "prompt": prompt, "stream": False}
    #     )
    #     raw = response.json()["response"]
    #     print(raw)
    #     return raw
    #     #return ast.literal_eval(raw.strip())  # safely parse the dict
    # except Exception as e:
    #     print(f"Error processing article: {e}")
    #     return None
    #     #return {'company': None, 'region': None, 'sector': None}

    try:
        api_key = os.getenv("GEMINI_API_KEY")  # Replace with env management for security
        if not api_key:
            raise ValueError("API key not found. Please set the GEMINI_API_KEY.")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        response_obj = model.generate_content(prompt)

        if not response_obj or not response_obj.candidates or not response_obj.candidates[0].content.parts:
            print("Error: No valid response from Gemini model")
            return None

        raw = response_obj.candidates[0].content.parts[0].text
        # print(raw)
        return raw.strip()

    except Exception as e:
        print(f"Error processing article: {e}")
        return None

def combine_company_names(row):
    ner = row.get("company_names_ner")
    llm = row.get("company_names_llm_ner")
    combined = list(set(
        x for x in (
            (ner if isinstance(ner, list) else [ner]) +
            (llm if isinstance(llm, list) else [llm])
        )
        if x is not None
    ))
    return combined if combined else None

def combine_sectors(row):
    ner = row.get("sectors_ner")
    llm = row.get("sectors_llm_ner")
    combined = list(set(
        x for x in (
            (ner if isinstance(ner, list) else [ner]) +
            (llm if isinstance(llm, list) else [llm])
        )
        if x is not None
    ))
    return combined if combined else None

def combine_columns_single(val1, val2):
    combined = list(set(
        x for x in (
            (val1 if isinstance(val1, list) else [val1]) +
            (val2 if isinstance(val2, list) else [val2])
        )
        if x is not None
    ))
    return combined if combined else None

# Extract company using spaCy NER and fuzzy match

def extract_company(text, confidence_score_arg):
    #print("Next article...")
    doc = nlp(str(text))
    orgs = list(set(ent.text for ent in doc.ents if ent.label_ == "ORG"))
    #print("Orgs:" + ", ".join(orgs))

    match_list = []

    for org in orgs:
        #print("Current org:" + org)
        match, score, _ = process.extractOne(org, known_companies)
        #print("Current match:" + match)
        #print("Current score:" + str(score))
        if score >= confidence_score_arg:
            match_list.append(match)
            #print("Current match list:" + ", ".join(match_list))

    if match_list == []:
        #print("Returned None")
        return None
        
    else:
        unique_list = list(set(match_list))
        #print("Final match list:" + ", ".join(unique_list))
        return unique_list
    
def extract_region(text, confidence_score_arg=85):
    #cleaned_text = preprocess_text(str(text))
    #print("cleaned text:" + cleaned_text)
    doc = nlp(str(text))
    #print("text:" + text)
    regions = list(set(ent.text for ent in doc.ents if ent.label_ == "GPE"))
    #print("regions:"+", ".join(regions))

    match_list = []
    article = 1

    for region in regions:
        #print("article" + str(article))
        article += 1
        #print("current region:" + region)
        match, score, _ = process.extractOne(region, country_to_region.keys())
        #print("match + score:" + match + str(score))
        if score >= confidence_score_arg:
            mapped_region = country_to_region[match]
            match_list.append(mapped_region)
            #print("current match_list:" + ", ".join(match_list))

    if not match_list:
        return None
    else:
        #print("returned match_list:" + ", ".join(match_list))
        return list(set(match_list))  # Return unique mapped regions
    
def classify_sector(text, threshold=80):
    #print("Running classify_sector function")
    text = str(text).lower()
    matched_sectors = []

    for sector, keywords in SECTOR_KEYWORDS.items():
        for keyword in keywords:
            score = fuzz.partial_ratio(keyword.lower(), text)
            if score >= threshold:
                matched_sectors.append(sector)
                break  # Stop after first match for this sector

    return list(set(matched_sectors)) if matched_sectors else None

def lookup_sectors_from_companies(company_list):
    #print("Running lookup_sectors_from_companies function")
    if not company_list:
        return None
    sectors = set()
    for company in company_list:
        #print("Current ner company:" + company)
        match = sp500_plus2.loc[sp500_plus2["Security"] == company, "GICS Sector"]
        #print("Current ner sector match:" + match)
        if not match.empty:
            sectors.add(match.iloc[0])
    #print("Returned list of ner sectors:" + ", ".join(list(sectors)))
    return list(sectors) if sectors else None

### NEWS_INTERPRETER_TAGGER FUNCTIONS END HERE ###

def news_interpreter_tagger(news_text):
    # Step 1: Extract summary-like LLM response
    llm_output = extract_info_from_article(news_text)

    #print("Extracting from raw description...")
    company_names_ner = extract_company(news_text, 90)
    regions_ner = extract_region(news_text, 90)

    #print("Extracting from LLM output...")
    company_names_llm_ner = extract_company(llm_output, 90)
    regions_llm_ner = extract_region(llm_output, 90)
    sectors_llm_ner = classify_sector(llm_output, 90)

    # Combine company names
    company_names = combine_company_names({
        "company_names_ner": company_names_ner,
        "company_names_llm_ner": company_names_llm_ner
    })

    # Sector from company lookup
    sectors_ner = lookup_sectors_from_companies(company_names)

    # Combine sectors
    sectors = combine_sectors({
        "sectors_ner": sectors_ner,
        "sectors_llm_ner": sectors_llm_ner
    })

    # Combine regions
    regions = combine_columns_single(regions_ner, regions_llm_ner)

    # Return result as tuple or dictionary
    return company_names, regions, sectors

def news_interpreter(news_text, summary_length):
    summary = news_interpreter_summariser(news_text, summary_length)
    companies, regions, sectors = news_interpreter_tagger(news_text)
    return {
            "summary": summary,
            "metadata": {
                "companies": companies,
                "regions": regions,
                "sectors": sectors
            }
        }

# def ensure_list(item):
#     if isinstance(item, str):
#         return [i.strip() for i in item.split(',')]
#     elif isinstance(item, list):
#         return [i.strip() for i in item]
#     else:
#         return []