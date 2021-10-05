---
id: 1451
title: Несколько полезных трюков для файла функций темы в WordPress
date: 2014-08-25T20:23:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=1451
permalink: /multiple-tricks-for-wordpress-theme-functions/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - FromHabrSandbox

---
WordPress является великолепной платформой, предлагая надежную разработку и бесконечные настройки. Используя данную cms, я узнал несколько полезных трюков, которыми хочу поделиться с Вами:

### 1. Удаляем поле URL в форме комментариев.

```php
add_filter('comment_form_default_fields', 'my_remove_url');
function my_remove_url($arg) {
    $arg['url'] = '';
    return $arg;
}
```


### 2. В административной части блога показываем автору только его записи.

```php
add_filter('parse_query', 'my_parse_query_useronly' );
function my_parse_query_useronly( $wp_query ) {
    if ( strpos( $_SERVER[ 'REQUEST_URI' ], '/wp-admin/edit.php' ) !== false ) {
        if ( !current_user_can( 'level_10' ) ) {
            global $current_user;
            $wp_query->set( 'author', $current_user->id );
        }
    }
}
```


### 3. Запрещаем авторам обновлять и удалять записи после определенного периода.

В примере используется период в 7 дней.

```php
add_filter( 'user_has_cap', 'my_limit_editing', 10, 3 );
function my_limit_editing( $allcaps, $cap, $args ) {
    if( 'edit_post' != $args[0] && 'delete_post' != $args[0]
      || !empty( $allcaps['manage_options'] )
      || empty( $allcaps['edit_posts'] ) )
        return $allcaps;
    $post = get_post( $args[2] );
    if( 'publish' != $post->post_status )
        return $allcaps;
    if( strtotime( $post->post_date ) &lt; strtotime( '-7 day' ) ) {
        $allcaps[$cap[0]] = false;
    }
    return $allcaps;
}
```


### 4. Узнаем время последнего посещения блога автором по его логину.

```php
add_action('wp_login','author_last_login');
function author_last_login($login) {
    global $user_ID;
    $user = get_user_by('login', $login);
    update_user_meta($user->ID, 'last_login', current_time('mysql'));
}
```


Пример:

```php
$last_login = get_user_meta($user_id, 'last_login', true);
if ( !empty($last_login) ) { echo $last_login; }
```

### 5. Используем jQuery c Яндекса.

Заменяем <номер версии> на номер нужной Вам версии jQuery.

```php
add_action('wp_enqueue_scripts','load_jquery_from_yandex');
function load_jquery_from_yandex() {
   if( !is_admin() ){
       wp_deregister_script('jquery-core');
       wp_register_script('jquery-core', 'http://yandex.st/jquery/&lt;номер версии>/jquery.min.js', false, '');
   }
}

```


### 6. Добавляем колонку с ID пользователей во вкладку «Пользователи» в админке.

```php
add_filter('manage_users_columns', 'show_user_id_column');
add_action('manage_users_custom_column',  'show_user_id_column_content', 10, 3);
function show_user_id_column( $columns ) {
    $columns['user_id'] = 'ID';
    return $columns;
}
function show_user_id_column_content($value, $column_name, $user_id) {
    if ( 'user_id' == $column_name )
        return $user_id;
    return $value;
}
```


### 7. Используем SSL на определеных страницах.

В примере используется страница с номером ID 773.

```php
add_action('template_redirect', 'force_ssl');
function force_ssl()
{
    if (is_page(773) && !is_ssl () )
    {
      header('HTTP/1.1 301 Moved Permanently');
      header("Location: https://" . $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"]);
      exit();
    }
    else if (!is_page(773) && is_ssl() )
    {
        header('Location: http://' . $_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI']);
        exit();
    }
}
```


### 8. Запрещаем комментарии на attachments страницах.

```php
add_filter( 'comments_open', 'filter_media_comment_status', 10 , 2 );
function filter_media_comment_status( $open, $post_id ) {
    $post = get_post( $post_id );
    if( $post->post_type == 'attachment' ) {
        return false;
    }
    return $open;
}
```


### 9. Следующая / предыдущая запись автора.

```php
function get_prev_post_by_author($link="« %link", $title="%title") {
        global $wpdb, $post;
        $authorid = $post->post_author;
        $prev = $wpdb->get_row($wpdb->prepare("SELECT ID, post_title FROM $wpdb->posts WHERE post_type='post' AND post_status='publish' AND post_author= %d AND post_date &lt; '".$post->post_date."' ORDER BY post_date DESC LIMIT 1;", $authorid));
        if($prev) {
                $title = preg_replace('/%title/',$prev->post_title, $title);
                echo preg_replace('/%link/', '<a href="'.get_permalink($prev->ID).'" rel="prev">'.$title.'</a>', $link);
        }
}                               

function get_next_post_by_author($link="%link »", $title="%title") {
        global $wpdb, $post;
        $authorid = $post->post_author;
        $next = $wpdb->get_row($wpdb->prepare("SELECT ID, post_title FROM $wpdb->posts WHERE post_type='post' AND post_status='publish' AND post_author= %d AND post_date > '".$post->post_date."' ORDER BY post_date ASC LIMIT 1;", $authorid));
        if($next) {
                $title = preg_replace('/%title/',$next->post_title, $title);
                echo preg_replace('/%link/', '<a href="'.get_permalink($next->ID).'" rel="next">'.$title.'</a>', $link);
        }
}
```


Спасибо хабрапользователю <a href="http://habrahabr.ru/sandbox/86285/" target="_blank">Шмидт</a>
