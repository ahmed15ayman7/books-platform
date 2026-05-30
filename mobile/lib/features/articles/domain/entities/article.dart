import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class Article extends Equatable {
  const Article({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.categoryLabel,
    required this.channel,
    required this.date,
    required this.readMinutes,
    required this.coverColors,
    this.hasVideo = false,
  });

  final String id;
  final String title;
  final String excerpt;
  final String categoryLabel;
  final String channel;
  final String date;
  final int readMinutes;
  final List<Color> coverColors;
  final bool hasVideo;

  @override
  List<Object?> get props => [id];
}
