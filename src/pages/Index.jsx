import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data: topStories } = await axios.get(
          'https://hacker-news.firebaseio.com/v0/topstories.json'
        );
        const top5Stories = topStories.slice(0, 5);
        const storyDetails = await Promise.all(
          top5Stories.map(async (id) => {
            const { data: story } = await axios.get(
              `https://hacker-news.firebaseio.com/v0/item/${id}.json`
            );
            return story;
          })
        );
        setStories(storyDetails);
        setFilteredStories(storyDetails);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <div className={cn('min-h-screen p-4', darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black')}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
        <div className="flex items-center space-x-2">
          <span>Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;