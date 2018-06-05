JSONEditor.defaults.editors.select2 = JSONEditor.defaults.editors.select.extend({
  setValue: function(value,initial) {
    value = this.typecast(value||'');

    if(this.value === value) {
      return;
    }

    // make sure value is in options
    this.theme.setSelectOptions(this.input, [value]);
    this.input.value = value;
    if(this.select2) {
      if(this.select2v4)
        this.select2.val(this.input.value).trigger("change");
      else
        this.select2.select2('val',this.input.value);
    }
    this.value = value;
    this.onChange();
    this.change();
  },
  getNumColumns: function() {
    return 3; // FIXME
  },
  preBuild: function() {
    this.input_type = 'select';
  },
  build: function() {
    var self = this;
    if(!this.options.compact) this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    if(this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);
    if(this.options.infoText) this.infoButton = this.theme.getInfoButton(this.options.infoText);
    if(this.options.compact) this.container.className += ' compact';

    this.input = this.theme.getSelectInput([]);

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.onInputChange();
    });

    this.control = this.theme.getFormControl(this.label, this.input, this.description, this.infoButton);
    this.container.appendChild(this.control);
  },
  onInputChange: function() {
    var val = this.typecast(this.input.value);

    // If valid hasn't changed
    if(val === this.value) return;

    // Store new value and propogate change event
    this.value = val;
    this.onChange(true);
  },
  setupSelect2: function() {
    // If the Select2 library is loaded use it when we have lots of items
    if(window.jQuery && window.jQuery.fn && window.jQuery.fn.select2) {
      var options = $extend({},JSONEditor.plugins.select2);
      if(this.schema.options && this.schema.options.select2_options) options = $extend(options,this.schema.options.select2_options);
      this.select2 = window.jQuery(this.input).select2(options);
      this.select2v4 = this.select2.select2.hasOwnProperty("amd");

      var self = this;
      this.select2.on('select2-blur',function() {
        if(self.select2v4)
          self.input.value = self.select2.val();
        else
          self.input.value = self.select2.select2('val');

        self.onInputChange();
      });

      this.select2.on('change',function() {
        if(self.select2v4)
          self.input.value = self.select2.val();
        else
          self.input.value = self.select2.select2('val');

        self.onInputChange();
      });
    }
    else {
      this.select2 = null;
    }
  },
  onWatchedFieldChange: function() {
  }
});
