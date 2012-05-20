var util = {};
(function () {

    var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var convert_hundreds = function(num) {
        if (num > 99) {
            return ones[Math.floor(num / 100)] + "hundred" + convert_tens(num % 100);
        }
        else {
            return convert_tens(num);
        }
    };
    var  convert_tens = function(num) {
        if (num < 10) return ones[num];
        else if (num >= 10 && num < 20) return teens[num - 10];
        else {
            return tens[Math.floor(num / 10)] + ones[num % 10];
        }
    };
    //single public function
    util.convert = function(num) {
        if (num == 0) return "zero";
        else return convert_hundreds(num);
    };
})();

(function ($) {

    var $errorList = $("#errorList"),
        $gridHolder = $("#demoGridholder"),
        $resultCss = $("#resultCss"),
        $ieCss = $("#IECss"),
        $exampleHtml = $("#exampleHtml"),
        addComments = true;
        addInsertedMargines = true;

    function logError(msg) {
        $errorList.show();
        $errorList.append("<li>" + msg + "</li>");
    }

    //returns size in percentage
    function getRealtiveSizeFor(targetPx, contextPx) {
        return targetPx / contextPx * 100;
    }

    //calculates the pixel width of a column, taking into account context and margin
    function getColumnWidthPx(numberOfColumnsTotal, numberOfColumnsSize, contextPx, marginPx, hasMarginLeft, hasMarginRight) {
        var fullMarginPx = (hasMarginLeft ? marginPx / 2 : 0) + (hasMarginRight ? marginPx / 2 : 0);
        return ((contextPx / numberOfColumnsTotal) * numberOfColumnsSize) - fullMarginPx;
    }

    //calculates the percentual width of a column, taking into account context and margin
    function getColumnWidthPercent(numberOfColumnsTotal, numberOfColumnsSize, contextPx, marginPx, hasMarginLeft, hasMarginRight) {
        return getRealtiveSizeFor(getColumnWidthPx(numberOfColumnsTotal, numberOfColumnsSize, contextPx, marginPx, hasMarginLeft, hasMarginRight), contextPx);
    }

    function generateGrid() {
        var resultTxt = "/*fluid nested grid generator */\n"; ;
        var resultTxtInnerMargine = "";
        var numCols = Number($("#numberColsInput").val()) || 0;
        var marginWidth = Number($("#marginInput").val()) || 0;
        var contextWidth = Number($("#contextWidthInput").val()) || 800;
        var nestedLevel = Number($("#nestedLevelInput").val()) || 0;
        var exampleHtml = "";
        addComments = $("#addCommentsCheck").is(":checked");
        addInsertedMargines = $("#addInsertedMargines").is(":checked");

        if (!numCols && numCols < 1) {
            logError("Please specify the number of Columns (>0)");
            return;
        }

        $gridHolder.empty();
        $gridHolder.css("maxWidth", contextWidth);

        resultTxt += ".gridHolder { width:100%; max-width: " + contextWidth + "px; }\n";
        resultTxt += ".row {float:left; clear:both; width:100%; }\n";

        exampleHtml = "<div class=\"gridHolder\">\n\t<div class=\"row\">";

        for (var i = 1; i <= numCols; i++) {
            resultTxt += "." + util.convert(i) + ((i < numCols) ? ", " : " ");

            if (i < numCols) {
                exampleHtml += "\n\t\t<div class=\"" + util.convert(i) + "\">" + util.convert(i) + " (of " + numCols + ")";
                exampleHtml += "</div> <div class=\"" + util.convert(numCols - i) + "\">" + util.convert(numCols - i) + " (of " + numCols + ")</div>";
            } else {
                console.log();
                if (nestedLevel > 1) {
                    exampleHtml += "\n\t\t<div class=\"" + util.convert(i) + "\">\n\t\t\t<div class=\"row\">";
                    for (var j = 1; j <= numCols; j++) {
                        var classes = util.convert(1) + (j === 1 ? " no-margin-left" : (j === numCols ? " no-margin-right" : ""));
                        exampleHtml += "\n\t\t\t\t<div class=\"" + classes + "\">Level Two: "+util.convert(1) +" (of " + numCols + ")</div>";
                    }

                    exampleHtml += "\n\t\t\t</div>";
                    exampleHtml += "\n\t\t</div>";
                    exampleHtml += "\n\t\t<div class=\"" + util.convert(i) + "\">\n\t\t\t<div class=\"row\">";
                    for (var j = 1; j <= numCols; j++) {
                        var classes = util.convert(1) + (j === 1 ? " no-margin-left" : (j === numCols ? " no-margin-right" : ""));

                        if (j == 2) {
                            classes += " insert-margin-right";
                        } else if (j > 2 && j < numCols - 2) {
                            classes += " insert-margin";
                        } else if (j > 2 && j < numCols - 1) {
                            classes += " insert-margin-left";
                        }
                        exampleHtml += "\n\t\t\t\t<div class=\"" + classes + "\">Level Two: " + util.convert(1) + " (of " + numCols + ")</div>";

                    }

                    exampleHtml += "\n\t\t\t</div>";
                } else {
                    exampleHtml += "\n\t\t<div class=\"" + util.convert(i) + "\">" + util.convert(i) + " (of " + numCols + ")</div>";
                }
                exampleHtml += "\n\t\t</div>";
            }
        }
        exampleHtml += "\n\t</div>\n</div>";

        resultTxt += "{box-sizing: border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box;}\n";


        resultTxt += "\n";        
        resultTxtInnerMargine += "\n";

        for (var j = 1; j <= nestedLevel; j++) {
            var rowsSelector = "";
            for (var k = 1; k <= j; k++) {
                rowsSelector += ".row ";
            }
            resultTxt += rowsSelector + ".no-margin-left, " + rowsSelector + ".no-margin {margin-left:0;}\n";
            resultTxt += rowsSelector + ".no-margin-right, " + rowsSelector + ".no-margin {margin-right:0;}\n";
            resultTxtInnerMargine += rowsSelector + ".insert-margin-left, " + rowsSelector + ".insert-margin {margin-left:0;}\n";
            resultTxtInnerMargine += rowsSelector + ".insert-margin-right, " + rowsSelector + ".insert-margin {margin-right:0;}\n";            
        }
       
        if(addInsertedMargines) {
            resultTxt += resultTxtInnerMargine;
        }

        var singleColumnPxWidth = (contextWidth - (numCols * marginWidth)) / numCols;
        //recursively create styles and demo elements
        resultTxt = "\n" + generateNestedGrid(1, nestedLevel, numCols, numCols, resultTxt, contextWidth, singleColumnPxWidth, marginWidth, null, null);


        $resultCss.val($.trim(resultTxt));
        $exampleHtml.val($.trim(exampleHtml));

        //        var ieTxt = "<!--[if lt IE 8]>\n"
        //        + "<style type=\"text/css\">\n"
        //        + "\t/* Border Box fix IE6+7 */\n"
        //        + "\t#gridHolder div {behavior: url(/boxsizing.htc); display:inline; }\n"
        //        + "\t.gridHolder {width:" + contextWidth + "px; }\n"
        //        + "</style>\n"
        //        + "<![endif]-->";


        //        $ieCss.val(ieTxt);
    }






    //recursively create child grids
    function generateNestedGrid(level, numLevels, numberColumnsToCalculate, numberColumnsTotal, resultTxt, contextWidth, singleColumnPxWidth, marginWidth, parentClass, parentDemoElement) {
        parentClass = parentClass || "";
        var $holderRow;
        var currColumnWidthPerc;
        var subMarginWidthPerc;
        var currColumnWidthNoMarginPerc;
        var currColumnWidthSingleMarginPerc;
        var currColumnWidthFirstLastPerc;
        var currColumnWidthPx;
        var resultTxtSingleMargin = "";
        var resultTxtInsertMargins = "";
        var currColumnFullClassName = "";

        if (addComments) {
            if (parentClass === "") {
                resultTxt += "\n\n/*level" + level + "*/\n";
            } else {
                resultTxt += "\n\n/*level" + level + " under " + parentClass.replace(/\t/g, "").replace(/ +/g, " ") + "*/\n";
            }
        }


        //direct children - css text and render demo nodes
        for (var i = 1; i <= numberColumnsToCalculate; i++) {
            currColumnWidthPerc = getRealtiveSizeFor(singleColumnPxWidth * i + marginWidth * (i - 1), contextWidth);
            currColumnWidthNoMarginPerc = getRealtiveSizeFor((singleColumnPxWidth * i) + ((i) * marginWidth), contextWidth);
            currColumnWidthSingleMarginPerc = getRealtiveSizeFor((singleColumnPxWidth * i) + ((i - 0.5) * marginWidth), contextWidth);
            currColumnMarginWidthPerc = getRealtiveSizeFor(marginWidth / 2, contextWidth);
            currColumnFullClassName = parentClass + (parentClass === "" ? "" : " ") + "." + util.convert(i);

            //TODO: check do do the test with CSS selectors
            //CSS3 [class^=no-margine-right],   [class^=no-margine-left],   [class^=no-margine]

            resultTxt += currColumnFullClassName + " { " + (level === 1 ? "float:left; " : "") + "width:" + currColumnWidthPerc + "%; margin-right:" + currColumnMarginWidthPerc + "%; margin-left:" + currColumnMarginWidthPerc + "%; }" + "\n";
            if(addInsertedMargines){
                resultTxtSingleMargin += currColumnFullClassName + ".insert-margin-right { width:" + currColumnWidthSingleMarginPerc + "%;" + (level === 1 ? "  margin-right:0;" : "") + " padding-right:" + currColumnMarginWidthPerc + "%; }" + "\n";
                resultTxtSingleMargin += currColumnFullClassName + ".insert-margin-left { width:" + currColumnWidthSingleMarginPerc + "%;" + (level === 1 ? "  margin-left:0;" : "") + " padding-left:" + currColumnMarginWidthPerc + "%; }" + "\n";
                resultTxtInsertMargins += currColumnFullClassName + ".insert-margin { width:" + currColumnWidthNoMarginPerc + "%;" + (level === 1 ? " margin-right:0; margin-left:0;" : "") + " padding-left:" + currColumnMarginWidthPerc + "%;  padding-right:" + currColumnMarginWidthPerc + "%;}" + "\n";
            }
            if (!parentDemoElement) {
                $holderRow = ($("<div />", { "class": "row level1" }))
                        .append($("<div />", { "class": " column " + util.convert(i) })
                                           .css({ "width": currColumnWidthPerc + "%", "marginRight": currColumnMarginWidthPerc + "%", "marginLeft": currColumnMarginWidthPerc + "%" })
                                           .text(util.convert(i) + " (of " + numberColumnsTotal+")")
                               );
                //append a full row for the single item
                if (i === 1) {
                    for (var j = 2; j <= numberColumnsTotal; j++) {
                        $holderRow.append($("<div />", { "class": " column " + util.convert(i) })
                                           .css({ "width": currColumnWidthPerc + "%", "marginRight": currColumnMarginWidthPerc + "%", "marginLeft": currColumnMarginWidthPerc + "%" })
                                           .text(util.convert(i) + " (of " + numberColumnsTotal + ")"));

                    }

                }
                $holderRow.appendTo($gridHolder);
            } else {
                if (i < numberColumnsToCalculate && numberColumnsToCalculate > 1) {
                    $holderRow = $("<div />", { "class": "row level" + level.toString() });

                    var divLeft = $("<div>", { "class": "column " + util.convert(i) + " no-margin-left" })
                        .css({ "width": currColumnWidthPerc + "%", "marginRight": currColumnMarginWidthPerc + "%" })
                        .text(util.convert(i) + " (of " + numberColumnsTotal + ")");

                    var reveseColumnWidth = getRealtiveSizeFor((singleColumnPxWidth * (numberColumnsToCalculate - i)) + (((numberColumnsToCalculate - i) - 1) * marginWidth), contextWidth);
                    var divRight = $("<div>", { "class": "column " + util.convert(numberColumnsToCalculate - i) + " no-margin-right" })
                        .css({ "width": reveseColumnWidth + "%", "marginLeft": currColumnMarginWidthPerc + "%" })
                        .text(util.convert(numberColumnsToCalculate - i) + " (of " + numberColumnsTotal + ")");


                    $holderRow.append(divLeft)
                              .append(divRight)
                              .appendTo(parentClass);
                } else {
                    $holderRow = $("<div />", { "class": "row level" + level })
                    .append($("<div />", { "class": "column " + util.convert(i) + " no-margin" })
                                        .css({ "width": currColumnWidthPerc + "%" })
                                        .text(util.convert(i) + " (of " + numberColumnsTotal + ")")
                           )
                    .appendTo(parentClass);
                }
            }

        }

        if(addInsertedMargines) {
            resultTxt += (addComments ? "/*both margins inserted*/\n" : "") + resultTxtInsertMargins;        
            resultTxt += (addComments ? "/*single-margin*/\n" : "") + resultTxtSingleMargin;
        }
        //nested children - recursive call
        for (var i = 1; i <= numberColumnsToCalculate; i++) {
            var subparentClass = parentClass + (parentClass === "" ? "" : " ") + "." + util.convert(i) + " ";
            //currColumnWidthPx = getColumnWidthPx(numberColumnsToCalculate, i, contextWidth, marginWidth, (level === 1), (level === 1));
            currColumnWidthPx = ((singleColumnPxWidth) * i) + ((i - 1) * marginWidth);
            if (level < numLevels) {
                if (level === 2) {
                    console.log(numberColumnsTotal, currColumnWidthPx, singleColumnPxWidth);
                }
                resultTxt = generateNestedGrid(level + 1, numLevels, i, numberColumnsTotal, resultTxt, currColumnWidthPx, singleColumnPxWidth, marginWidth, subparentClass, $holderRow);
            }
        }
        return resultTxt;

    }


    //init stuff
    $("#generateBtn").click(generateGrid).trigger("click");


})(jQuery)