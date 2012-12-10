/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! Impim Admin - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* https://github.com/globocom/impim-admin\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'Globo.com; Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'static/js/**/*.js', 'tests/js/**/*.js']
    },
    concat: {
      jquery_form: {
        src: ['static/js/jquery.form.js'],
        dest: 'dist/jquery.form.js'
      },
      jquery_jcrop: {
        src: ['static/js/jquery.Jcrop.js'],
        dest: 'dist/jquery.Jcrop.js'
      },
      impim: {
        src: [
          '<banner:meta.banner>',
          '<file_strip_banner:static/js/libby.objectRemap.js>',
          '<file_strip_banner:static/js/libby.widgetBase.js>',
          '<file_strip_banner:static/js/impim.url.js>',
          '<file_strip_banner:static/js/images.popin.js>',
          '<file_strip_banner:static/js/images.popin.search.js>',
          '<file_strip_banner:static/js/images.popin.search.filters.js>',
          '<file_strip_banner:static/js/images.popin.search.thumbnails.js>',
          '<file_strip_banner:static/js/images.popin.search.info.js>',
          '<file_strip_banner:static/js/images.popin.search.pager.js>',
          '<file_strip_banner:static/js/images.popin.upload.js>',
          '<file_strip_banner:static/js/images.popin.crop.js>',
          '<file_strip_banner:static/js/images.popin.crop.flip.js>',
          '<file_strip_banner:static/js/images.popin.crop.cropper.js>',
          '<file_strip_banner:static/js/images.popin.crop.sizeselect.js>',
          '<file_strip_banner:static/js/images.popin.crop.info.js>',
          '<file_strip_banner:static/js/images.popin.crop.sizes.js>',
          '<file_strip_banner:static/js/images.popin.crop.options.js>',
          '<file_strip_banner:static/js/images.popin.crop.minipreview.js>',
          '<file_strip_banner:static/js/images.popin.preview.js>',
          '<file_strip_banner:static/js/images.init.js>',
          '<file_strip_banner:static/js/images.js>'
        ],
        dest: 'dist/impim-<%= meta.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.impim.dest>'],
        dest: 'dist/impim-<%= meta.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

  grunt.registerTask('dist', 'concat min');
};
