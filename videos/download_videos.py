#!/usr/bin/env python3
"""
Script to download YouTube videos in MP4 format.
"""

import yt_dlp
import os
from pathlib import Path

# List of YouTube video URLs to download
VIDEO_URLS = [
    "https://www.youtube.com/watch?v=cs1rq3PN1Dg",
    "https://www.youtube.com/watch?v=4_cJSLorQdg",
    "https://www.youtube.com/watch?v=h-jbfM2z3Pw",
    "https://www.youtube.com/watch?v=uzn1cZ1Up_8",
]

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent


def extract_video_id(url):
    """
    Extract video ID from YouTube URL.
    
    Args:
        url: YouTube video URL
        
    Returns:
        Video ID string
    """
    if 'watch?v=' in url:
        return url.split('watch?v=')[1].split('&')[0]
    elif 'youtu.be/' in url:
        return url.split('youtu.be/')[1].split('?')[0]
    return None


def download_video(url, output_dir):
    """
    Download a YouTube video in MP4 format.
    
    Args:
        url: YouTube video URL
        output_dir: Directory to save the video
    """
    video_id = extract_video_id(url)
    if not video_id:
        print(f"Could not extract video ID from: {url}\n")
        return
    
    # Configure yt-dlp options - use video ID as filename for predictable naming
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': str(output_dir / f'{video_id}.mp4'),
        'merge_output_format': 'mp4',
        'noplaylist': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Downloading: {url}")
            ydl.download([url])
            print(f"Successfully downloaded: {url} -> {video_id}.mp4\n")
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}\n")


def main():
    """Main function to download all videos."""
    # Create output directory if it doesn't exist
    output_dir = SCRIPT_DIR
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Downloading videos to: {output_dir}\n")
    
    # Download each video
    for url in VIDEO_URLS:
        download_video(url, output_dir)
    
    print("All downloads completed!")


if __name__ == "__main__":
    main()

