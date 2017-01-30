module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            min: {
                files: grunt.file.expandMapping([
                    'assets/js/*.js',
                    '!assets/js/*.min.js',
                    '!assets/js/*.min-latest.js'
                ], 'assets/js/', {
                    rename: function (destBase, destPath) {
                        return destBase + destPath.replace('.js', '.min.js');
                    },
                    flatten: true
                })
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            minify: {
                expand: true,
                cwd: 'assets/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'assets/css/',
                ext: '.min.css'
            }
        },
        clean: ['build/'],
        copy: {
            build: {
                options: {
                    mode: true
                },
                src: [
                    '**',
                    '!node_modules/**',
                    '!releases/**',
                    '!bin/**',
                    '!build/**',
                    '!releases/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!.gitignore',
                    '!.gitmodules',
                    '!.gitattributes',
                    '!composer.lock',
                    '!naming-conventions.txt',
                    '!how-to-grunt.md',
                    '!.travis.yml',
                    '!.scrutinizer.yml',
                    '!phpunit.xml',
                    '!tests/**'
                ],
                dest: 'build/<%= pkg.textdomain %>/'
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: 'releases/<%= pkg.textdomain %>-<%= pkg.version %>.zip'
                },
                expand: true,
                cwd: 'build/',
                src: [
                    '**/*',
                    '!build/*'
                ]
            }
        },
        replace: {
            core_file: {
                src: ['plugincore.php'],
                overwrite: true,
                replacements: [{
                    from: /Version:\s*(.*)/,
                    to: "Version: <%= pkg.version %>"
                }, {
                    from: /define\(\s*'DBPT_VER',\s*'(.*)'\s*\);/,
                    to: "define( 'DBPT_VER', '<%= pkg.version %>' );"
                }]
            }
        }
    });

    //load modules
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-text-replace');
    //installer tasks
    grunt.registerTask('default', ['clean', 'replace', 'cssmin', 'uglify']);


};
