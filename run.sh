#!/bin/bash
/usr/bin/sh -ec 'cd frontend && /usr/bin/npm start &'
/usr/bin/sh -ec 'cd backend && /usr/bin/python3 manage.py runserver'