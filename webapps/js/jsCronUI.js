(function ($) {
	$.fn.jsCronUI = function (settings) {
		var value;

		if (typeof settings === 'string') {
			//call method
			var args = Array.prototype.slice.call(arguments, 1);

			this.each(function () {
				var instance = $.data(this, 'jsCronUI');
				if (!instance) {
					throw new CronError(11, settings, [settings]);
				}
				if (!$.isFunction(instance[settings]) || settings.charAt(0) === '_') {
					throw new CronError(10, settings, [settings]);
				}
				value = instance[settings].apply(instance, args);
			});
		} else {
			return this.each(function () {
				var $this = $(this);
				var cron = new jsCronUI(settings, $this);

				$(this).data('jsCronUI', cron);
			});
		}

		return typeof value !== 'undefined' ? value : this;
	};
}).call(this, jQuery);

(function ($) {
	/*
		10-19: Generic errors
		20-29: Time-related errors
		30-39: Daily-specific errors
		40-49: Weekly-specific errors
		50-59: Monthly-specific errors
		60-69: Yearly-specific errors
		70-79: Non-implementation errors
		80	 : Unknown errors
	*/
	var errorList = [
		{ id: 10, message: 'No such method %1.' },
		{ id: 11, message: 'Cannot call method %1 on jsCronUI prior to initialization.' },
		{ id: 12, message: 'Could not load schedule with expression: %1.' },
		{ id: 13, message: 'A schedule type is required.' },
		{ id: 14, message: 'No template found or provided. Please provide a template or include the default template file.' },
		{ id: 20, message: 'A time is required.' },
		{ id: 30, message: 'A daily or weekday repetition pattern selection is required.' },
		{ id: 40, message: 'One or more days of the week are required.' },
		{ id: 50, message: 'A date or day of week selection is required.' },
		{ id: 51, message: 'Must provide one or more days.' },
		{ id: 52, message: 'Must select a day of the week.' },
		{ id: 53, message: 'Must select an occurrence.' },
		{ id: 54, message: 'Invalid days: %1.' },
		{ id: 60, message: 'Could not understand yearly schedule options: %1.' },
		{ id: 61, message: 'A month and date or day of week selection is required.' },
		{ id: 62, message: 'Must select one or more months.' },
		{ id: 63, message: 'Must provide one or more days.' },
		{ id: 64, message: 'Must choose a day of the week.' },
		{ id: 65, message: 'Must choose an occurrence.' },
		{ id: 66, message: 'Invalid days: %1.' },
		{ id: 70, message: 'Not implemented: %1.toEnglishString.' },
		{ id: 73, message: 'Not implemented: Monthly.%1.toEnglishString.' },
		{ id: 74, message: 'Not implemented: Yearly.%1.toEnglishString.' },
		{ id: 80, message: 'Unknown error occurred inside jsCronUI library: %1.' }
	];

	function CronError(number, additionalData, substitutions) {
		this.number = number;
		this.message = errorList.filter(function (error) {
			return error.id === number;
		})[0].message;

		if (substitutions) {
			for (var i = substitutions.length - 1; i >= 0; i--) {
				this.message = this.message.replace(new RegExp('%' + (i + 1), 'g'), substitutions[i]);
			}
		}

		this.data = additionalData;
		this.stack = (new Error()).stack;
	}

	CronError.prototype = Object.create(Error.prototype);
	CronError.prototype.constructor = CronError;

	this.CronError = CronError;
}).call(this, jQuery);

(function ($) {
	function jsCronUI (settings, $element) {
		var self = this;
		self.$el = $($element);

		if (settings) {
			self.$bindTo = settings.bindTo || null;
			self.initialValue = settings.initialValue;
		}

		var disableUiUpdates = false;
		var currentState = {
			time: '',
			pattern: '',
			selected: '',
			days: [],
			occurrence: '',
			dayOfWeek: '',
			months: []
		};

		this.reset = function () {
			currentState = {
				time: '',
				pattern: '',
				selected: '',
				days: [],
				occurrence: '',
				dayOfWeek: '',
				months: []
			};

			disableUiUpdates = true;
			resetDom();
			disableUiUpdates = false;
		};

		function resetDom () {
			self.$el.find('input:radio,input:checkbox').prop('checked', false).change();
			self.$el.find('input:text').val('').change();
			hideAll();
			self.$el.find('.c-schedule-options').hide();
			self.$el.find('[name="time"]').attr('data-time', '');
			self.$el.find('select[multiple]').multipleSelect('setSelects', []);

			updateDom();
		}

		function init () {

			if (settings && (!settings.container || !settings.container instanceof jQuery)) {

				if ($.fn.jsCronUI.template) {
					self.$el.append($.fn.jsCronUI.template());
				} else {
					throw new CronError(14);
				}
			}

			wireEvents();

			if (self.$bindTo && self.$bindTo instanceof jQuery && self.initialValue) {
				self.setCron(self.initialValue);
			}

			self.$el.find('div input,select').on('change', function () {
				cleanInputs();
				updateFromDom();
			});
		};

		this.setCron = function (expression) {
			function pad (string, max) {
				string = string.toString();

				return string.length < max ? pad('0' + string, max) : string;
			}

			var inDays, days, i;

			if (!expression) {
				return;
			}

			//Model expression format: ss MM hh dd mm ww yyyy
			var values = expression.split(' ');

			if (values.length === 6) {
				values.push('*'); //explicitely declare every year
			}

			if (values.length !== 7) {
				throw new CronError(12, expression, [expression]);
			}

			//reset model to default values
			this.reset();

			currentState.time = pad(values[2], 2) + ':' + pad(values[1], 2);

			if (values[4] !== '*') {
				//Expression is yearly
				currentState.pattern = 'yearly';
				currentState.months = values[4].split(',');

				if (values[3] !== '?') {
					//Specific day of the month
					currentState.selected = 'specificDay';
					currentState.days = values[3].split(',');
				} else if (values[5].indexOf('#') > 0) {
					//Specific occurrence of the month
					currentState.selected = 'weekOccurrence';
					var occArr = values[5].split('#');

					currentState.dayOfWeek = occArr[0];
					currentState.occurrence = '#' + occArr[1];
				} else if (values[5].indexOf('L') > 0) {
					//Specific occurrence of the month
					currentState.selected = 'weekOccurrence';

					currentState.occurrence = 'L';
					currentState.dayOfWeek = values[5].split('L')[0];
				} else {
					throw new CronError(60, expression, [expression]);
				}
			} else if (values[3] === '*' || values[5] === '*') {
				//Expression is daily - every day
				currentState.pattern = 'daily';
				currentState.selected = 'daily';
			} else if (values[5] === '2-6' || values[5] === '2,3,4,5,6') {
				//Expression is daily - weekdays
				currentState.pattern = 'daily';
				currentState.selected = 'weekday';
			} else if (values[5].indexOf('#') === -1 && values[5].indexOf('L') === -1 && values[5] !== '?') {
				//Expression is weekly
				currentState.pattern = 'weekly';
				if (values[5].indexOf('-') > 0) {
					inDays = values[5].split('-');
					days = [];
					for (i = parseInt(inDays[0]); i <= parseInt(inDays[1]); i++) {
						days.push(i);
					};
					currentState.days = days;
				} else {
					currentState.days = values[5].split(',');
				}
			} else {
				//Expression is monthly
				currentState.pattern = 'monthly';

				if (values[3] === 'L') {
					currentState.selected = 'last';
				} else if (values[5].indexOf('#') > 0) {
					var weekdays = values[5].split('#');

					currentState.selected = 'week';
					currentState.dayOfWeek = weekdays[0];
					currentState.occurrence = '#' + weekdays[1];
				} else if (values[5].indexOf('L') > 0) {
					var weekday = values[5].split('L')[0];

					currentState.selected = 'week';
					currentState.dayOfWeek = weekday;
					currentState.occurrence = 'L';
				} else {
					currentState.selected = 'date';
					if (values[3].indexOf('-') > 0) {
						inDays = values[3].split('-');
						days = [];
						for (i = parseInt(inDays[0]); i <= parseInt(inDays[1]); i++) {
							days.push(i);
						};
						currentState.days = days;
					} else {
						currentState.days = values[3].split(',');
					}

				}
			}

			disableUiUpdates = true;
			updateDom();
			disableUiUpdates = false;
		};

		this.getCron = function (validate) {
			var minute = '*',
				hour = '*',
				dayOfMonth = '*',
				month = '*',
				year = '*',
				dayOfWeek = '?';

			switch (currentState.pattern) {
				case 'daily':
					switch (currentState.selected) {
						case 'daily':
							//Do nothing - use defaults
							break;
						case 'weekday':
							dayOfWeek = '2-6';
							dayOfMonth = '?';
							break;
						default:
							if (validate) {
								throw new CronError(30, currentState.selected);
							}
					}
					break;
				case 'weekly':
					dayOfWeek = currentState.days.join(',');
					if (validate && !dayOfWeek) {
						throw new CronError(40, currentState.pattern);
					}
					dayOfMonth = '?';
					break;
				case 'monthly':
					switch (currentState.selected) {
						case 'date':
							dayOfMonth = currentState.days.join(',');
							break;
						case 'last':
							dayOfMonth = 'L';
							break;
						case 'week':
							dayOfMonth = '?';
							dayOfWeek = currentState.dayOfWeek + currentState.occurrence;
							break;
						default:
							if (validate) {
								throw new CronError(50, currentState.selected);
							}
					}
					break;
				case 'yearly':
					month = currentState.months.join(',');
					switch (currentState.selected) {
						case 'specificDay':
							dayOfMonth = currentState.days.join(',');
							break;
						case 'weekOccurrence':
							dayOfMonth = '?';
							dayOfWeek = currentState.dayOfWeek + currentState.occurrence;
							break;
						default:
							if (validate) {
								throw new CronError(61, currentState.selected);
							}
					}
					break;
				default:
					if (validate) {
						throw new CronError(13, currentState.pattern);
					}
					break;
			}

			if (currentState.time && currentState.time !== '') {
				var timeArr = currentState.time.split(':');
				hour = parseInt(timeArr[0]) + '';
				minute = parseInt(timeArr[1]) + '';
			} else {
				if (validate) {
					throw new CronError(20);
				}
			}

			var cron = ['0', minute, hour, dayOfMonth, month, dayOfWeek, year]; //Default state = every minute

			cron = cron.map(function (val) {
				//if the value is blank, and validation is disabled
				if (val === '' && !validate) {
					return '*';
				}

				if (validate) {
					validateState();
				}

				return val.toString();
			});

			return cron.join(' ');
		};

		function validateState () {
			//Check for errors in the state of the current model
			if (!currentState.time) {
				throw new CronError(20);
			}

			switch (currentState.pattern) {
				case 'daily':
					switch (currentState.selected) {
						case 'daily':
						case 'weekday':
							//No validation options when these are selected
							break;
						default:
							//No option is selected
							throw new CronError(30, currentState.selected);
					}
					break;
				case 'weekly':
					if (currentState.days.length === 0 || $.inArray('', currentState.days) >= 0) {
						throw new CronError(40, currentState.pattern);
					}
					break;
				case 'monthly':
					switch (currentState.selected) {
						case 'last':
							//No validation when this is selected
							break;
						case 'date':
							if (currentState.days.length === 0 || $.inArray('', currentState.days) >= 0) {
								throw new CronError(51);
							}

							var invalidDays = [];

							$.each(currentState.days, function (index, value) {
								if (value > 31) {
									invalidDays.push(value);
								}
							});
							if (invalidDays.length > 0) {
								throw new CronError(54, null, [invalidDays.join(', ')]);
							}

							break;
						case 'week':
							if (!currentState.occurrence) {
								throw new CronError(53);
							}

							if (!currentState.dayOfWeek) {
								throw new CronError(52);
							}
							break;
						default:
							throw new CronError(50, currentState.selected);
					}
					break;
				case 'yearly':
					switch (currentState.selected) {
						case 'specificDay':
							if (currentState.months.length === 0 || $.inArray('', currentState.months) >= 0) {
								throw new CronError(62);
							}

							if (currentState.days.length === 0 || $.inArray('', currentState.days) >= 0) {
								throw new CronError(63);
							}

							var invalidDays = [];

							$.each(currentState.days, function (index, value) {
								if (value > 31) {
									invalidDays.push(value);
								}
							});
							if (invalidDays.length > 0) {
								throw new CronError(66, null, [invalidDays.join(', ')]);
							}

							break;
						case 'weekOccurrence':
							if (!currentState.occurrence) {
								throw new CronError(65);
							}

							if (!currentState.dayOfWeek) {
								throw new CronError(64);
							}

							if (currentState.months.length === 0 || $.inArray('', currentState.months) >= 0) {
								throw new CronError(62);
							}
							break;
						default:
							throw new CronError(61, currentState.selected);
					}
					break;
				default:
					throw new CronError(13, currentState.pattern);
			}

			return true;
		};

		function stringToTimeSpan (val) {
			if (!val)
				return undefined;

			var AMtoPMthreshold = 8;

			var time = val.trim().match(/^(\d{1,2})(?::)*([0-5][0-9])?\s*((P|A)(?:M)?)?$/i);
			if (time === null)
				return null;

			var hours = Number(time[1]);
			var minutes = time[2] ? Number(time[2]) : 0;
			var ampm = time[4];

			//Return invalid if military time with AM/PM qualifier.
			if ((hours > 12 && ampm) ||
				hours > 23)
				return null;

			//consider threshold.
			if (!ampm && hours < 12 && hours > 0 && (hours < AMtoPMthreshold && time[1].length === 1))
				hours = hours + 12;

			//if PM and hours are between 1 and 11.
			if (hours < 12 && hours > 0 && ampm && ampm.toUpperCase() === 'P')
				hours = hours + 12;
			if (hours === 12 && ampm && ampm.toUpperCase() === 'A')
				hours = 0;

			var sHours = hours.toString();
			var sMinutes = minutes.toString();
			if (hours < 10)
				sHours = '0' + sHours;
			if (minutes < 10 && minutes !== '00')
				sMinutes = '0' + sMinutes;

			return sHours + ':' + sMinutes + ':00';
		};

		function timeSpanToString (val) {
			if (!val)
				return undefined;

			var time = val.trim().match(/^(\d{2})(?::)(\d{2})(?::)?(\d{2})?$/i);
			if (time === null)
				return null;

			var hours = Number(time[1]);
			var minutes = Number(time[2]);
			var ampm = 'am';

			if (hours >= 12) {
				ampm = 'pm';
				hours = hours === 12 ? 12 : hours - 12;
			}
			if (hours === 0)
				hours = 12;

			return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm.toUpperCase();
		};

		function evaluate ($element) {
			var value = $element.val();

			var military = '';
			if (!value) {
				military = $element.attr('data-time');
			} else {
				military = stringToTimeSpan(value);
			}
			var result = timeSpanToString(military);
			$element.attr('data-time', military).val(result).change();
		};

		function cleanInputs () {
			var dayCleanList = ['[name="date"]', '[name="dayOfMonth"]'];

			$.each(dayCleanList, function (idx, obj) {
				var regex = /[^\d\.\-]/g,
					monthlyDays = self.$el.find(obj),
					monthlySplit = monthlyDays.val().split(/[\s,]+/),
					monthlyUnique = monthlySplit.map(function (value) {
						if (!value) {
							return value;
						}

						var clean = value.replace(regex, '');

						if (value.indexOf('-') >= 0) {
							var pre = clean.substring(0, clean.indexOf('-')),
								post = clean.substring(clean.indexOf('-') + 1, clean.length);

							return Math.floor(pre) + '-' + Math.floor(post);
						}

						return Math.floor(clean).toString();
					}).filter(function (item, index, array) {
						return array.length == 0 || (item && index === array.indexOf(item));
					});

				if (monthlyDays.val() && monthlySplit.toString() !== monthlyUnique.toString()) {
					monthlyDays.val(monthlyUnique.join()).change();
				}
			});
		};

		function updateDom () {
			self.$el.find('.c-schedule-type input:radio[value="' + currentState.pattern + '"]').prop('checked', true).change();
			self.$el.find('[name="time"]').val(currentState.time);
			self.$el.find('[name="time"]').trigger('blur');

			switch (currentState.pattern) {
				case 'daily':
					self.$el.find('[name="dailyPattern"][value="' + currentState.selected + '"]').prop('checked', true).change();
					break;
				case 'weekly':
					$.each(currentState.days, function () {
						self.$el.find('[name="weeklyDays"] input:checkbox[value="' + this + '"]').prop('checked', true).change();
					});
					break;
				case 'monthly':
					self.$el.find('.js-schedule-monthly [name="monthlyPattern"][value="' + currentState.selected + '"]').prop('checked', true).change();
					self.$el.find('.js-schedule-monthly [name="date"]').val(currentState.days.join()).change();
					self.$el.find('.js-schedule-monthly [name="weekOccurrence"]').val(currentState.occurrence).change();
					self.$el.find('.js-schedule-monthly [name="dayOfWeek"]').val(currentState.dayOfWeek).change();
					break;
				case 'yearly':
					self.$el.find('.js-schedule-yearly [name="yearPattern"][value="' + currentState.selected + '"]').prop('checked', true).change();
					self.$el.find('.js-schedule-yearly [name="dayOfMonth"]').val(currentState.days.join()).change();
					self.$el.find('.js-schedule-yearly [name="weekOccurrence"]').val(currentState.occurrence).change();
					self.$el.find('.js-schedule-yearly [name="dayOfWeek"]').val(currentState.dayOfWeek).change();

					if (currentState.selected === 'specificDay') {
						self.$el.find('.js-schedule-yearly [name="monthSpecificDay"]').multipleSelect('setSelects', currentState.months);
					}

					if (currentState.selected === 'weekOccurrence') {
						self.$el.find('.js-schedule-yearly [name="monthOccurrence"]').multipleSelect('setSelects', currentState.months);
					}
					break;
			}
		};

		function formatArray(arr){
			if (arr.length === 1){
				return arr[0];
			}

			if (arr.length === 2){
				return arr.join(' and ');
			}

			if (arr.length > 2){
				return arr.slice(0, -1).join(', ') + ' and ' + arr.slice(-1);
			}

			return '';
		};

		function updateFromDom () {
			if (disableUiUpdates) {
				return;
			}

			currentState.pattern = self.$el.find('[name="ScheduleType"]:checked').val();
			currentState.time = self.$el.find('[name="time"]').attr('data-time');

			switch (currentState.pattern) {
				case 'daily':
					currentState.selected = self.$el.find('[name="dailyPattern"]:checked').val();
					break;
				case 'weekly':
					currentState.days = self.$el.find('div[name="weeklyDays"] input:checkbox:checked').map(function () {
						return this.value;
					}).get();
					break;
				case 'monthly':
					currentState.selected = self.$el.find('.js-schedule-monthly [name="monthlyPattern"]:checked').val();
					currentState.occurrence = self.$el.find('.js-schedule-monthly [name="weekOccurrence"]').val();
					currentState.dayOfWeek = self.$el.find('.js-schedule-monthly [name="dayOfWeek"]').val();
					currentState.days = self.$el.find('.js-schedule-monthly [name="date"]').val().split(/[\s,]+/).sort(function (a, b){
						return a - b;
					});
					break;
				case 'yearly':
					currentState.selected = self.$el.find('.js-schedule-yearly [name="yearPattern"]:checked').val();
					currentState.months = self.$el.find(currentState.selected === 'specificDay' ? '.js-schedule-yearly [name="monthSpecificDay"]' : '.js-schedule-yearly [name="monthOccurrence"]').multipleSelect('getSelects');
					currentState.days = self.$el.find('.js-schedule-yearly [name="dayOfMonth"]').val().split(/[\s,]+/).sort(function (a, b) {
						return a - b;
					});
					currentState.occurrence = self.$el.find('.js-schedule-yearly [name="weekOccurrence"]').val();
					currentState.dayOfWeek = self.$el.find('.js-schedule-yearly [name="dayOfWeek"]').val();
					break;
			}

			if (self.$bindTo && self.$bindTo.val() !== self.getCron()) {
				self.$bindTo.val(self.getCron()).change();
			}
		};

		function hideAll () {
			self.$el.find('.js-schedule-daily').hide();
			self.$el.find('.js-schedule-weekly').hide();
			self.$el.find('.js-schedule-monthly').hide();
			self.$el.find('.js-schedule-yearly').hide();
		};

		function wireEvents () {
			self.$el.find('select[name^="month"]').multipleSelect({
				width: 230,
				multiple: true,
				multipleWidth: 100,
				placeholder: 'Select months',
				selectAll: false,
				minimumCountSelected: 4,
				ellipsis: true,
				allSelected: 'Every month'
			});

			self.$el.find('[name="ScheduleType"]').on('change', function () {
				self.$el.find('.c-schedule-options').show();
				var scr = '.js-schedule-' + $(this).val();
				hideAll();
				self.$el.find(scr).show();
			});

			//auto-evaluate the time entered on blur
			self.$el.find('input[name="time"]').on('blur', function () {
				evaluate(self.$el.find('input[name="time"]'));
			});

			//Wire events to auto-change the subtype when fields change
			self.$el.find('.js-schedule-monthly').find('select[name="dayOfWeek"],select[name="weekOccurrence"]').on('change', function () {
				if (disableUiUpdates) {
					return;
				}

				if (currentState.selected !== 'week') {
					self.$el.find('[name="monthlyPattern"][value="week"]').prop('checked', true).change();
				}
			});

			self.$el.find('.js-schedule-monthly input[name="date"]').on('keypress', function () {
				if (disableUiUpdates) {
					return;
				}

				if (currentState.selected !== 'date') {
					self.$el.find('[name="monthlyPattern"][value="date"]').prop('checked', true).change();
				}
			});

			self.$el.find('.js-schedule-yearly').find('select[name="monthOccurrence"],select[name="dayOfWeek"],select[name="weekOccurrence"]').on('change', function () {
				if (disableUiUpdates) {
					return;
				}

				if (currentState.selected !== 'weekOccurrence') {
					self.$el.find('[name="yearPattern"][value="weekOccurrence"]').prop('checked', true).change();
				}
			});

			self.$el.find('.js-schedule-yearly').find('select[name="monthSpecificDay"]').on('change', function () {
				if (disableUiUpdates) {
					return;
				}

				if (currentState.selected !== 'specificDay') {
					self.$el.find('[name="yearPattern"][value="specificDay"]').prop('checked', true).change();
				}
			});

			self.$el.find('.js-schedule-yearly input[name="dayOfMonth"]').on('keypress', function () {
				if (disableUiUpdates) {
					return;
				}

				if (currentState.selected !== 'specificDay') {
					self.$el.find('[name="yearPattern"][value="specificDay"]').prop('checked', true).change();
				}
			});
		};

		this.toEnglishString = function () {
			var result = '';

			var toTimeString = function (val) {
				var time = val.trim().match(/^(\d{2})(?::)(\d{2})(?::)?(\d{2})?$/i);
				if (time === null)
					return null;

				var hours = Number(time[1]);
				var minutes = Number(time[2]);
				var ampm = 'am';

				if (hours >= 12) {
					ampm = 'pm';
					hours = hours === 12 ? 12 : hours - 12;
				}
				if (hours === 0)
					hours = 12;

				return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm.toUpperCase();
			}

			var timeString = toTimeString(currentState.time);

			var toAltValues = function (stringsArr, values) {
				var res;

				if ($.isArray(values)) {
					res = $(values).map(function (i, val) {
						return stringsArr[parseInt(val) - 1];
					});
				} else {
					res = stringsArr[parseInt(values) - 1];
				}

				return $.makeArray(res);
			}

			var toEnglishDays = function (values) {
				var dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

				return toAltValues(dayList, values);
			};

			var toEnglishMonths = function (values) {
				var monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

				return toAltValues(monthList, values);
			};

			var toEnglishOccurrence = function (values) {
				var occurrenceList = ['first', 'second', 'third', 'fourth', 'fifth'];

				return toAltValues(occurrenceList, values);
			};

			var toEnglishDaySuffix = function (value){
				if (value.indexOf('-') > 0){
					var days = $.map(value.split('-'), toEnglishDaySuffix);
					return days.join('-');
				}

				var suffix = 'th';
				switch (value + ''){
					case '1': case '21': case '31': suffix = 'st'; break;
					case '2': case '22': 						suffix = 'nd'; break;
					case '3': case '23':            suffix = 'rd'; break;
				}

				return value + suffix;
			};

			var numericSort = function(a, b){
				return a - b;
			};

			switch (currentState.pattern) {
				case 'daily':
					result = 'Every ' + (currentState.selected === 'weekday' ? 'week' : '') + 'day at ' + timeString;
					break;
				case 'weekly':
					result = 'Every week on ' + formatArray(toEnglishDays(currentState.days)) + ' at ' + timeString;
					break;
				case 'monthly':
					result = 'Every month on the ';
					switch (currentState.selected) {
						case 'date':
							result += formatArray($.map(currentState.days, toEnglishDaySuffix)) + ' at ' + timeString;
							break;
						case 'week':
							if (currentState.occurrence !== '') {
								if (currentState.occurrence === 'L') {
									result += 'last';
								} else {
									result += toEnglishOccurrence(currentState.occurrence.split('#'));
								}

								result += ' ' + toEnglishDays(currentState.dayOfWeek) + ' at ' + timeString;
							}
							break;
						case 'last':
							result += 'last day of the month at ' + timeString;
							break;
						default:
							throw new CronError(73, currentState.selected, [currentState.selected]);
					}
					break;
				case 'yearly':
					result = 'Every year on ';
					switch (currentState.selected) {
						case 'specificDay':
							result += formatArray(toEnglishMonths(currentState.months)) + ' ' + formatArray($.map(currentState.days, toEnglishDaySuffix)) + ' at ' + timeString;
							break;
						case 'weekOccurrence':
							result += 'the ';
							if (currentState.occurrence === 'L') {
								result += 'last ';
							} else {
								result += toEnglishOccurrence(currentState.occurrence.split('#')) + ' ';
							}

							result += toEnglishDays(currentState.dayOfWeek) + ' of ' + formatArray(toEnglishMonths(currentState.months)) + ' at ' + timeString;
							break;
						default:
							throw new CronError(74, currentState.selected, [currentState.selected]);
					}

					break;
				default:
					throw new CronError(70, currentState.pattern, [currentState.pattern]);
			}

			return result;
		};

		try {
			init();
		} catch (e) {
			throw new CronError(80, e, [e.message]);
		}
	}

	this.jsCronUI = jsCronUI;
}).call(this, jQuery);
