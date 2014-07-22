angular.module('www.tekuchi.converter').factory('dataProvider', [
    function()                                                                  {
        var csv         = require('to-csv');
        var service     = {};
        var rows        = [];
        
        function chooseTypeFor(field)                                           {
            var type    = service.types[0];
            
            for (var i in service.types) {
                var item    = service.types[i];
                var weight  = item.name.length/field.length;
                if (item.special || field.toLowerCase().indexOf(item.name.toLowerCase()) < 0 || item.weight > weight) continue;
                //
                if (item.field) for (var j in service.fields) if (service.fields[j].name == item.field)
                    service.fields[j].type = service.types[0]
                
                item.field  = field;
                item.weight = weight;
                type        = item;
            }
            
            return type;
        }
        
        function resetTypes()                                                   {
            for (var i in service.types) service.types[i].field = '';
        }
        
        service.types   = [
            {name: '-',                 special:true},
            {name: 'model',             special:true},
            {name: 'metadata',          special:true},
            {name: 'block',             order: 1,   field: '',  weight: 0},
            {name: 'floor',             order: 2,   field: '',  weight: 0},
            {name: 'name',              order: 3,   field: '',  weight: 0},
            {name: 'type',              order: 4,   field: '',  weight: 0},
            {name: 'typology',          order: 5,   field: '',  weight: 0},
            {name: 'state',             order: 6,   field: '',  weight: 0},
            {name: 'flippable',         order: 7,   field: '',  weight: 0},
            {name: 'release',           order: 8,   field: '',  weight: 0},
            {name: 'inactive',          order: 9,   field: '',  weight: 0},
            {name: 'totalAreaFT',       order: 10,  field: '',  weight: 0},
            {name: 'totalAreaM',        order: 11,  field: '',  weight: 0},
            {name: 'terraceArea',       order: 12,  field: '',  weight: 0},
            {name: 'balconyArea',       order: 13,  field: '',  weight: 0},
            {name: 'beds',              order: 14,  field: '',  weight: 0},
            {name: 'aspect',            order: 15,  field: '',  weight: 0},
            {name: 'overlay',           order: 16,  field: '',  weight: 0},
            {name: 'penthouse',         order: 17,  field: '',  weight: 0},
            {name: 'parking',           order: 18,  field: '',  weight: 0},
            {name: 'cost',              order: 19,  field: '',  weight: 0},
            {name: 'category',          order: 20,  field: '',  weight: 0},
            {name: 'floors',            order: 21,  field: '',  weight: 0},
            {name: 'house',             order: 22,  field: '',  weight: 0},
            {name: 'estServCharge',     order: 23,  field: '',  weight: 0},
            {name: 'estServChargeRate', order: 24,  field: '',  weight: 0},
            {name: 'rentWeekly',        order: 25,  field: '',  weight: 0},
            {name: 'rentAnnual',        order: 26,  field: '',  weight: 0},
            {name: 'netYeld',           order: 27,  field: '',  weight: 0},
            {name: 'grossYeld',         order: 28,  field: '',  weight: 0},
            {name: 'pricePerSqrFeet',   order: 29,  field: '',  weight: 0}
        ];
        //
        service.fields  = [];
        service.rows    = [];
        service.setData = function(data)                                        {
            resetTypes();
            service.fields.length    = 0;
            service.rows.length      = 0;
            if (!data.length) return;
            //
            var template    = data[0];
            for (var property in template) service.fields.push({name: property, value: template[property], type: chooseTypeFor(property), extra: ''});
            for (var i in data) service.rows.push(data[i]);
        };
        
        service.translateAvail = function(val)                                  {
            var parsedVal = (val + '').toLowerCase();
            
            switch(parsedVal)                                                   {
                case '0':   return 'unreleased';
                case '1':   return 'sold';
                case '2':   return 'reserved';
                case '3':   return 'reserved';
                case '4':   return 'reserved';
                case '5':   return 'available';
                case '6':   return 'hold';
                default:    return val; 
            }
        };

        service.toFile = function(data)                                         {
            if (!data || !data.length) return '';
            var csvData     = csv(data); 
            var blob        = new Blob([csvData], {type: "application/csv"});
            return URL.createObjectURL(blob);
        }
        
        //
        return service;
    }
]);
