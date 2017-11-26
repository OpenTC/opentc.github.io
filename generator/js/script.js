'use strict';

var app = angular.module('generator', []);

function hexpad(val) {
    val = val.toString();

    while (val.length < 4) {
        val = '0' + val;
    }

    return val;
}

app.filter('hex', function(){
    return function(input) {
        return input == 'TC_ROOT' ? 'TC_ROOT' : '0x' + hexpad(parseInt(input).toString(16).toLocaleUpperCase() || 0);
    }
})

app.filter('nbytes', function() {
    return function(input) {
        var type = input.type;
        var highNibble = (type >> 12) & 0xf;

        if (highNibble == 0xf || highNibble == 0xe) {
            var elementCount = (type >> 4) & 0xf;
            var primitiveSize = (type) & 0xf;

            if (highNibble == 0xe) { // array
                var length = input.length;
                var totalElements = elementCount * length;
                var totalBytes = totalElements * primitiveSize + 2;

                return totalBytes;
            }

            return primitiveSize * elementCount;
        } else {
            return 0;
        }
    }
});

var vartypes = {
    TC_VARTYPE_UINT8: 0xFF11,
    TC_VARTYPE_UINT16: 0xFF12,
    TC_VARTYPE_UINT32: 0xFF14,
    TC_VARTYPE_UINT64: 0xFF18,
    TC_VARTYPE_UINT8VEC2: 0xFF21,
    TC_VARTYPE_UINT8VEC3: 0xFF31,
    TC_VARTYPE_UINT16VEC2: 0xFF22,
    TC_VARTYPE_UINT16VEC3: 0xFF32,
    TC_VARTYPE_UINT32VEC2: 0xFF24,
    TC_VARTYPE_UINT32VEC3: 0xFF34,
    
    TC_VARTYPE_INT8: 0xFE11,
    TC_VARTYPE_INT16: 0xFE12,
    TC_VARTYPE_INT32: 0xFE14,
    TC_VARTYPE_INT64: 0xFE18,
    TC_VARTYPE_INT8VEC2: 0xFE21,
    TC_VARTYPE_INT8VEC3: 0xFE31,
    TC_VARTYPE_INT16VEC2: 0xFE22,
    TC_VARTYPE_INT16VEC3: 0xFE32,
    TC_VARTYPE_INT32VEC2: 0xFE24,
    TC_VARTYPE_INT32VEC3: 0xFE34,
    
    TC_VARTYPE_FLOAT: 0xFD14,
    TC_VARTYPE_DOUBLE: 0xFD18,
    TC_VARTYPE_LDOUBLE: 0xFD1A,
    TC_VARTYPE_FLOATVEC2: 0xFD24,
    TC_VARTYPE_FLOATVEC3: 0xFD34,
    TC_VARTYPE_DOUBLEVEC2: 0xFD28,
    TC_VARTYPE_DOUBLEVEC3: 0xFD38,

    TC_VARTYPE_UINT8ARR: 0xEF11,
    TC_VARTYPE_UINT16ARR: 0xEF12,
    TC_VARTYPE_UINT32ARR: 0xEF13,
    TC_VARTYPE_UINT64ARR: 0xEF14,
    TC_VARTYPE_INT8ARR: 0xEE11,
    TC_VARTYPE_INT16ARR: 0xEE12,
    TC_VARTYPE_INT32ARR: 0xEE13,
    TC_VARTYPE_INT64ARR: 0xEE14,
    TC_VARTYPE_FLOATARR: 0xED14,
    TC_VARTYPE_DOUBLEARR: 0xED18,
    TC_VARTYPE_LDOUBLEARR: 0xED1A
}

app.filter('typename', function() {
    return function(input) {
        for (var i in vartypes) {
            if (vartypes[i] == input) {
                return i;
            }
        }

        return "NULL";
    }
})

app.controller('GeneratorController', function($scope) {
    $scope.varName = 'node';
    $scope.nodeName = 'Node 1';
    $scope.isRoot = false;
    $scope.nodeAddr = 0x1234;
    $scope.conNumber = 2;
    $scope.conChildren = 32;
    $scope.conBufSize = 256;
    $scope.varsMax = 64;
    $scope.servMax = 64;
    $scope.mesBufSize = 256;
    $scope.varCbMax = 16;
    $scope.rootVarReqMax = 64;
    $scope.servStoreMax = 16;

    $scope.isArray = function(v) {
        return ((v.type >> 12) & 0xf) == 0xe;
    }

    $scope.serials = [
        {
            port: 1,
            buffer: 64
        }
    ];

    this.addSerial = function() {
        $scope.serials.push({
            port: ~~(Math.random() * 0xffff),
            buffer: 64
        });
    }

    this.removeSerial = function(index) {
        $scope.serials.splice(index, 1);
    }

    this.vartypes = vartypes;

    $scope.vars = [
        {
            id: 1,
            type: vartypes.TC_VARTYPE_UINT8,
            length: 0
        }
    ]

    this.addVar = function() {
        $scope.vars.push({
            id: ~~(Math.random() * 0xffff),
            type: vartypes.TC_VARTYPE_UINT8,
            length: 0
        });
    }

    this.removeVar = function(index) {
        $scope.vars.splice(index, 1);
    }
});

app.filter('range', function(){
    return function(n) {
        n = parseInt(n) || 0;
        if (n > 256) {
            n = 256;
        }
        var res = [];
        for (var i = 0; i < n; i++) {
           res.push(i);
        }
        return res;
    };
});