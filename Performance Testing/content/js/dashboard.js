/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.08, "KoPercent": 5.92};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5211538461538462, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.83, 500, 1500, "https://pd.daffodilvarsity.edu.bd/website/translations/6b79f323218c2c0462983dbeea23bf35f3b8fa3c?mods=&lang="], "isController": false}, {"data": [1.0, 500, 1500, "https://pd.daffodilvarsity.edu.bd/wiki/get_comment?page_name=admission/online"], "isController": false}, {"data": [0.0, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online"], "isController": false}, {"data": [0.55, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://pd.daffodilvarsity.edu.bd/website/update_visitor_timezone"], "isController": false}, {"data": [0.26, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://pd.daffodilvarsity.edu.bd/admission/daffodil_chatbot/static/src/html/chatbot.html"], "isController": false}, {"data": [0.26, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-2"], "isController": false}, {"data": [0.0, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-3"], "isController": false}, {"data": [0.79, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-10"], "isController": false}, {"data": [0.58, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-0"], "isController": false}, {"data": [0.5933333333333334, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-1"], "isController": false}, {"data": [0.99, 500, 1500, "https://pd.daffodilvarsity.edu.bd/check_partial_payment_configuration?amount=0"], "isController": false}, {"data": [0.0, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-6"], "isController": false}, {"data": [0.91, 500, 1500, "https://pd.daffodilvarsity.edu.bd/website_sale_stock/static/src/xml/website_sale_stock_product_availability.xml"], "isController": false}, {"data": [0.33, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-7"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.51, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-4"], "isController": false}, {"data": [0.99, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-5"], "isController": false}, {"data": [0.98, 500, 1500, "https://pd.daffodilvarsity.edu.bd/get/type_wise_program?types=undefined"], "isController": false}, {"data": [0.47, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-11"], "isController": false}, {"data": [0.16, 500, 1500, "http://pd.daffodilvarsity.edu.bd/admission/online-12"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 74, 5.92, 11109.1632, 22, 124661, 563.5, 34521.2, 98322.90000000011, 122121.99, 9.951912359478998, 2572.037656232584, 7.312478603388427], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://pd.daffodilvarsity.edu.bd/website/translations/6b79f323218c2c0462983dbeea23bf35f3b8fa3c?mods=&lang=", 50, 0, 0.0, 491.28000000000003, 100, 1672, 304.5, 1332.5, 1615.5, 1672.0, 0.9557670986733953, 0.7457596795312919, 0.49748424178996065], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/wiki/get_comment?page_name=admission/online", 50, 0, 0.0, 115.28, 67, 414, 105.5, 139.9, 266.6499999999989, 414.0, 0.9993404353126937, 0.43525960366158334, 0.4928387888993264], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online", 50, 9, 18.0, 114068.76, 72456, 124661, 116198.5, 123728.3, 124015.1, 124661.0, 0.40077268974582997, 1150.3769501974807, 2.586956401942946], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-8", 50, 0, 0.0, 1092.2599999999998, 259, 5109, 723.5, 1735.8, 4069.6499999999937, 5109.0, 0.5732104370156372, 1.802478132021828, 0.28884432177741093], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/website/update_visitor_timezone", 50, 0, 0.0, 109.73999999999997, 68, 419, 104.0, 124.9, 143.49999999999994, 419.0, 1.000100010001, 0.47661016101610165, 0.6533856510651066], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-9", 50, 4, 8.0, 1908.219999999999, 183, 13509, 1443.0, 2932.0999999999995, 6125.549999999999, 13509.0, 0.5700409289386978, 18.36794342771311, 0.19256695130710386], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/admission/daffodil_chatbot/static/src/html/chatbot.html", 50, 50, 100.0, 720.3, 245, 2838, 503.0, 1628.5999999999997, 1957.1499999999983, 2838.0, 0.9594534952890834, 15.557388511503847, 0.5003400063323931], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-2", 50, 0, 0.0, 1998.3599999999994, 286, 5867, 1624.5, 4241.7, 5812.75, 5867.0, 0.5689188266618119, 5.8614195520333165, 0.2772368110393009], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-3", 50, 0, 0.0, 7173.419999999999, 1755, 19714, 6816.5, 12183.299999999996, 13811.799999999996, 19714.0, 0.559634670487106, 79.12490975890938, 0.2770847440790652], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-10", 50, 0, 0.0, 637.0399999999998, 221, 4922, 413.0, 1367.9999999999998, 1545.6999999999991, 4922.0, 0.5772872119336813, 32.44917888110193, 0.2519993981780816], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-0", 150, 0, 0.0, 9304.693333333325, 96, 46978, 308.0, 33939.900000000016, 39472.5, 46806.64, 1.2061271257990593, 261.2431307291039, 0.507264403168094], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-1", 150, 3, 2.0, 29059.73999999999, 22, 118303, 384.0, 97194.6, 108235.24999999997, 115412.83000000005, 1.2040552581093122, 764.4320681430057, 0.4635612743720852], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/check_partial_payment_configuration?amount=0", 50, 0, 0.0, 138.43999999999997, 80, 693, 120.0, 157.5, 407.04999999999995, 693.0, 0.9925361283150707, 0.4458658388915357, 0.6697680319001112], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-6", 50, 1, 2.0, 27454.159999999996, 6175, 47298, 28674.5, 42396.6, 45881.99999999999, 47298.0, 0.5332366397559909, 350.82292577612594, 0.4783715886185972], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/website_sale_stock/static/src/xml/website_sale_stock_product_availability.xml", 50, 0, 0.0, 193.45999999999995, 55, 858, 93.0, 541.1, 762.1999999999994, 858.0, 0.9564801530368245, 2.224937230989957, 0.46983351267336204], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-7", 50, 0, 0.0, 1889.3000000000004, 413, 12335, 1200.5, 3974.5, 5308.649999999992, 12335.0, 0.5631772206077809, 10.257085121421008, 0.28268856581289004], "isController": false}, {"data": ["Test", 50, 50, 100.0, 115980.24000000002, 75502, 125494, 118338.0, 124659.4, 124936.55, 125494.0, 0.3975510853144629, 1150.244610387513, 4.079495308897194], "isController": true}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-4", 50, 0, 0.0, 938.0799999999999, 143, 3648, 676.0, 1675.9, 2406.999999999998, 3648.0, 0.5665979194524398, 5.378242622186842, 0.24843990804115768], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-5", 50, 0, 0.0, 324.3599999999999, 254, 633, 316.5, 375.4, 410.6999999999999, 633.0, 0.5689058802111779, 1.4267092777170944, 0.21722871011969777], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/get/type_wise_program?types=undefined", 50, 0, 0.0, 142.98000000000002, 70, 1352, 106.5, 130.8, 477.84999999999945, 1352.0, 0.9916896408100121, 2.22645945724826, 0.44839092157718324], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-11", 50, 2, 4.0, 1164.1999999999998, 316, 5555, 749.0, 2303.7999999999997, 3229.2999999999947, 5555.0, 0.5791863590028727, 22.894795594274164, 0.4378286882587341], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-12", 50, 5, 10.0, 2076.1400000000003, 25, 6633, 1864.5, 3562.4999999999995, 5379.799999999997, 6633.0, 0.5807808017098187, 24.674529077516816, 0.26441407202843503], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: CRLF expected at end of chunk", 2, 2.7027027027027026, 0.16], "isController": false}, {"data": ["404/NOT FOUND", 50, 67.56756756756756, 4.0], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, 16.216216216216218, 0.96], "isController": false}, {"data": ["Assertion failed", 10, 13.513513513513514, 0.8], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 74, "404/NOT FOUND", 50, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 12, "Assertion failed", 10, "Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: CRLF expected at end of chunk", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online", 50, 9, "Assertion failed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-9", 50, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://pd.daffodilvarsity.edu.bd/admission/daffodil_chatbot/static/src/html/chatbot.html", 50, 50, "404/NOT FOUND", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-1", 150, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: CRLF expected at end of chunk", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-6", 50, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-11", 50, 2, "Non HTTP response code: org.apache.http.MalformedChunkCodingException/Non HTTP response message: CRLF expected at end of chunk", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["http://pd.daffodilvarsity.edu.bd/admission/online-12", 50, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
