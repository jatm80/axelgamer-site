+++
title = "{{ replace .File.ContentBaseName `-` ` ` | title }}"
type = "posts"
date = {{ .Date }}
draft = false
summary = ""
slug = "{{ .File.ContentBaseName }}"
url = "posts/{{ .File.ContentBaseName }}/"
+++

Write your article content here.
