import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlayCircle, Music, X, ArrowUpDown, ChevronDown } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import BackToSystem from "@/components/BackToSystem";

interface AggregateDataItem {
  artist_name?: string;
  track_name?: string;
  album_name?: string;
  year?: number;
  month?: number;
  day_of_week?: string;
  hour?: number;
  total_minutes: number;
  play_count: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const ALLOWED_GROUP_BY = [
  { value: 'artist_name', label: 'Artist Name', isTime: false },
  { value: 'track_name', label: 'Track Name', isTime: false },
  { value: 'album_name', label: 'Album Name', isTime: false },
  { value: 'year', label: 'Year', isTime: true },
  { value: 'month', label: 'Month', isTime: true },
  { value: 'day_of_week', label: 'Day of Week', isTime: false },
  { value: 'hour', label: 'Hour', isTime: true },
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Spotify = () => {
  const [data, setData] = useState<AggregateDataItem[]>([]);
  const [allArtists, setAllArtists] = useState<string[]>([]);
  const [topArtists, setTopArtists] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [limitError, setLimitError] = useState<string>("");

  // Filter states
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [groupByColumns, setGroupByColumns] = useState<string[]>([]);
  const [artistSearch, setArtistSearch] = useState<string>('');
  const [limit, setLimit] = useState<number | string>(10);
  const [topPerGroup, setTopPerGroup] = useState<boolean>(false);
  const [showTopArtists, setShowTopArtists] = useState<boolean>(true);
  const [recentMonths, setRecentMonths] = useState<number>(6); // Default to 6 months
  const [showFilters, setShowFilters] = useState<boolean>(false); // Collapsed by default
  
  // Table sorting
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load initial data and filters on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        await loadFilters();
        // Set the group by columns for the initial insight
        setGroupByColumns(['year']);
        // Load initial insight: minutes played over the years
        await fetchData(['year']);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Reload top artists when recent months filter changes
  useEffect(() => {
    if (!initialLoading) {
      loadFilters();
    }
  }, [recentMonths]);

  const loadFilters = async () => {
    try {
      // Calculate date range for recent top artists
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - recentMonths);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const [allArtistsResponse, topArtistsResponse, yearsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/artists`),
        fetch(`${API_BASE_URL}/artists/top?limit=20&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`),
        fetch(`${API_BASE_URL}/years`),
      ]);

      if (!allArtistsResponse.ok || !topArtistsResponse.ok || !yearsResponse.ok) {
        throw new Error('Failed to fetch filters');
      }

      const allArtistsData = await allArtistsResponse.json();
      const topArtistsData = await topArtistsResponse.json();
      const yearsData = await yearsResponse.json();

      setAllArtists(allArtistsData.Data || []);
      setTopArtists(topArtistsData.Data || []);
      setYears(yearsData.Data || []);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const fetchData = async (customGroupBy?: string[]) => {
    const groupBy = customGroupBy || groupByColumns;
    
    if (groupBy.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        group_by: groupBy.join(','),
        limit: String(limit || 50),
        top_per_group: topPerGroup.toString(),
      });

      if (selectedArtists.length > 0) {
        params.append('filter_artists', selectedArtists.join(','));
      }
      if (selectedYears.length > 0) {
        params.append('filter_years', selectedYears.join(','));
      }

      const response = await fetch(`${API_BASE_URL}/aggregate?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      
      // Sort data if it contains time-based columns
      const sortedData = sortDataByTimeColumns(result.data, groupBy);
      setData(sortedData);
      
      // Set default sort column to first group by column
      if (groupBy.length > 0 && !sortColumn) {
        setSortColumn(groupBy[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortDataByTimeColumns = (data: AggregateDataItem[], groupBy: string[]) => {
    if (!data || data.length === 0) return data;

    // Check if any time-based column is in the group by
    const timeColumn = groupBy.find(col => 
      ['year', 'month', 'hour'].includes(col)
    );

    if (!timeColumn) return data;

    // Sort by the time column
    return [...data].sort((a, b) => {
      const aVal = a[timeColumn as keyof AggregateDataItem];
      const bVal = b[timeColumn as keyof AggregateDataItem];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      return 0;
    });
  };

  const handleToggleGroupBy = (column: string) => {
    const newGroupBy = groupByColumns.includes(column)
      ? groupByColumns.filter((c) => c !== column)
      : [...groupByColumns, column];
    
    setGroupByColumns(newGroupBy);
  };

  const handleExecuteQuery = () => {
    fetchData();
  };

  const handleToggleArtist = (artist: string) => {
    setSelectedArtists(prev => 
      prev.includes(artist) 
        ? prev.filter(a => a !== artist)
        : [...prev, artist]
    );
  };

  const handleToggleYear = (year: number) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const handleLimitChange = (value: string) => {
    // Allow empty string for editing
    if (value === '') {
      setLimit('');
      setLimitError('');
      return;
    }
    
    const numValue = Number(value);
    
    // Allow any number while typing
    if (!isNaN(numValue)) {
      setLimit(numValue);
      setLimitError('');
    }
  };

  const handleLimitBlur = () => {
    const numValue = Number(limit);
    
    if (limit === '' || isNaN(numValue)) {
      setLimit(50);
      setLimitError('');
      return;
    }
    
    if (numValue < 1) {
      setLimitError("Limit must be at least 1");
      setLimit(1);
    } else if (numValue > 50) {
      setLimitError("Limit cannot exceed 50");
      setLimit(50);
    } else {
      setLimitError("");
    }
  };

  const formatMonthValue = (value: unknown): string => {
    if (typeof value === 'number' && value >= 1 && value <= 12) {
      return MONTH_NAMES[value - 1];
    }
    return String(value);
  };

  const getChartLabel = (item: AggregateDataItem): string => {
    return groupByColumns
      .map((field) => {
        const value = item[field as keyof AggregateDataItem];
        if (field === 'month') {
          return formatMonthValue(value);
        }
        return value;
      })
      .filter(Boolean)
      .join(' - ');
  };

  const getXAxisKey = (item: AggregateDataItem): string => {
    // If no groupByColumns set yet, default to first available key
    if (groupByColumns.length === 0) {
      // During initial load, try common time columns
      if (item.year) return String(item.year);
      if (item.month) return formatMonthValue(item.month);
      // Fallback to first available property
      const firstKey = Object.keys(item).find(key => 
        !['total_minutes', 'play_count'].includes(key)
      );
      return firstKey ? String(item[firstKey as keyof AggregateDataItem]) : '';
    }
    
    // Use the first time-based column if available, otherwise use first column
    const timeColumn = groupByColumns.find(col => 
      ALLOWED_GROUP_BY.find(g => g.value === col)?.isTime
    );
    
    if (timeColumn) {
      const value = item[timeColumn as keyof AggregateDataItem];
      if (timeColumn === 'month') {
        return formatMonthValue(value);
      }
      return String(value);
    }
    
    const label = getChartLabel(item);
    // Truncate long labels to prevent overflow
    return label.length > 30 ? label.substring(0, 27) + '...' : label;
  };

  const handleTableSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc');
    }
  };

  const getSortedTableData = () => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn as keyof AggregateDataItem];
      const bVal = b[sortColumn as keyof AggregateDataItem];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortOrder === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  };

  // Filter artists based on search and show top artists by default
  const getFilteredArtists = () => {
    const artistsToShow = showTopArtists ? topArtists : allArtists;
    
    if (!artistSearch) {
      return artistsToShow.slice(0, 20);
    }
    
    // Show search results as user types
    return allArtists
      .filter(artist => artist.toLowerCase().includes(artistSearch.toLowerCase()))
      .slice(0, 20);
  };

  const filteredArtists = getFilteredArtists();

  // Custom tooltip that shows all group by values
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: AggregateDataItem }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          {groupByColumns.map((col) => (
            <p key={col} className="text-sm font-medium text-foreground">
              <span className="font-semibold">
                {ALLOWED_GROUP_BY.find(g => g.value === col)?.label}:
              </span>{' '}
              {col === 'month' 
                ? formatMonthValue(data[col as keyof AggregateDataItem])
                : data[col as keyof AggregateDataItem]
              }
            </p>
          ))}
          <p className="text-sm text-foreground mt-2">
            <span className="font-semibold">Minutes:</span> {data.total_minutes.toFixed(2)}
          </p>
          <p className="text-sm text-foreground">
            <span className="font-semibold">Plays:</span> {data.play_count.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <BackToSystem />
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
              <Music className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Spotify Insights
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get to know me through my music!
          </p>
        </div>

        {/* Query Builder */}
        <Card className="p-6 bg-gradient-card border-border">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Query Builder
              </h2>
              <p className="text-muted-foreground">Build your Spotify insights query</p>
              <p className="text-muted-foreground">(For example, if you want to see my top tracks listening, click track)</p>
            </div>

            <div className="space-y-6">
              {/* Group By Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Group By (Select Multiple)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ALLOWED_GROUP_BY.map((col) => (
                    <Button
                      key={col.value}
                      type="button"
                      variant={groupByColumns.includes(col.value) ? "default" : "outline"}
                      onClick={() => handleToggleGroupBy(col.value)}
                      className={groupByColumns.includes(col.value) ? "bg-primary" : ""}
                    >
                      {col.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Top Per Group Option */}
              {groupByColumns.length > 1 && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="topPerGroup" 
                    checked={topPerGroup}
                    onCheckedChange={(checked) => setTopPerGroup(checked as boolean)}
                  />
                  <Label htmlFor="topPerGroup" className="text-sm cursor-pointer">
                    Show only top result per {ALLOWED_GROUP_BY.find(g => g.value === groupByColumns[0])?.label}
                  </Label>
                </div>
              )}

              {/* Filters Section - Collapsible */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Filters (Optional)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm"
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>
                </div>
                
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-md bg-secondary/50 animate-in slide-in-from-top-2 duration-200">
                    {/* Multi-Select Artist Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Artists (Search or Select Multiple)</Label>
                        <Select 
                          value={recentMonths.toString()} 
                          onValueChange={(val) => setRecentMonths(Number(val))}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Last month</SelectItem>
                            <SelectItem value="3">Last 3 months</SelectItem>
                            <SelectItem value="6">Last 6 months</SelectItem>
                            <SelectItem value="12">Last year</SelectItem>
                            <SelectItem value="999">All time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="text"
                          value={artistSearch}
                          onChange={(e) => {
                            setArtistSearch(e.target.value);
                            setShowTopArtists(false);
                          }}
                          placeholder="Search artists..."
                          className="bg-secondary"
                        />
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox 
                            id="showTop"
                            checked={showTopArtists}
                            onCheckedChange={(checked) => {
                              setShowTopArtists(checked as boolean);
                              setArtistSearch('');
                            }}
                          />
                          <Label htmlFor="showTop" className="text-sm cursor-pointer">
                            Show top 20 artists
                          </Label>
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-border rounded-md bg-secondary p-2 space-y-1">
                          {filteredArtists.map((artist) => (
                            <div key={artist} className="flex items-center space-x-2 p-1 hover:bg-accent rounded">
                              <Checkbox
                                id={`artist-${artist}`}
                                checked={selectedArtists.includes(artist)}
                                onCheckedChange={() => handleToggleArtist(artist)}
                              />
                              <Label 
                                htmlFor={`artist-${artist}`} 
                                className="text-sm cursor-pointer flex-1"
                              >
                                {artist}
                              </Label>
                            </div>
                          ))}
                        </div>
                        {selectedArtists.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedArtists.map(artist => (
                              <Badge key={artist} variant="secondary" className="text-xs flex items-center gap-1 pr-1">
                                <span>{artist}</span>
                                <button
                                  type="button"
                                  className="ml-1 hover:text-destructive focus:outline-none inline-flex items-center justify-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleToggleArtist(artist);
                                  }}
                                  aria-label={`Remove ${artist}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Multi-Select Year Filter */}
                    <div className="space-y-2">
                      <Label>Years (Select Multiple)</Label>
                      <div className="max-h-48 overflow-y-auto border border-border rounded-md bg-secondary p-2 space-y-1">
                        {years.map((year) => (
                          <div key={year} className="flex items-center space-x-2 p-1 hover:bg-accent rounded">
                            <Checkbox
                              id={`year-${year}`}
                              checked={selectedYears.includes(year)}
                              onCheckedChange={() => handleToggleYear(year)}
                            />
                            <Label 
                              htmlFor={`year-${year}`} 
                              className="text-sm cursor-pointer flex-1"
                            >
                              {year}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {selectedYears.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedYears.map(year => (
                            <Badge key={year} variant="secondary" className="text-xs flex items-center gap-1 pr-1">
                              <span>{year}</span>
                              <button
                                type="button"
                                className="ml-1 hover:text-destructive focus:outline-none inline-flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleToggleYear(year);
                                }}
                                aria-label={`Remove ${year}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Limit Section - Separate and Always Visible */}
              <div className="space-y-2">
                <Label htmlFor="limit" className="text-base font-semibold">Results Limit</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    onBlur={handleLimitBlur}
                    min="1"
                    max="50"
                    className="bg-secondary w-32"
                  />
                  <span className="text-sm text-muted-foreground">Maximum results to display (1-50)</span>
                </div>
                {limitError && (
                  <p className="text-sm text-red-500">{limitError}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleExecuteQuery}
              disabled={groupByColumns.length === 0 || loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              {loading ? "Loading..." : "Execute Query"}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        {initialLoading ? (
          <Card className="p-8 bg-gradient-card border-border">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">Loading initial insights...</p>
            </div>
          </Card>
        ) : data.length > 0 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Chart Section */}
            <Card className="p-6 bg-gradient-card border-border">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Chart Visualization</h3>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={data} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                    >
                      <defs>
                        <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1DB954" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#1ed760" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#ee5a6f" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey={getXAxisKey}
                        stroke="hsl(var(--muted-foreground))"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        verticalAlign="top"
                      />
                      <Bar 
                        dataKey="total_minutes" 
                        fill="url(#colorMinutes)" 
                        radius={[8, 8, 0, 0]}
                        name="Minutes Played"
                      />
                      <Bar 
                        dataKey="play_count" 
                        fill="url(#colorCount)" 
                        radius={[8, 8, 0, 0]}
                        name="Play Count"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Data Table */}
            <Card className="bg-gradient-card border-border overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Data Table</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      {groupByColumns.map((col) => (
                        <TableHead key={col} className="font-semibold">
                          <Button
                            variant="ghost"
                            onClick={() => handleTableSort(col)}
                            className="flex items-center gap-2 hover:bg-secondary"
                          >
                            {ALLOWED_GROUP_BY.find(g => g.value === col)?.label}
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                      ))}
                      <TableHead className="font-semibold">
                        <Button
                          variant="ghost"
                          onClick={() => handleTableSort('total_minutes')}
                          className="flex items-center gap-2 hover:bg-secondary"
                        >
                          Total Minutes
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="font-semibold">
                        <Button
                          variant="ghost"
                          onClick={() => handleTableSort('play_count')}
                          className="flex items-center gap-2 hover:bg-secondary"
                        >
                          Play Count
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedTableData().map((item, index) => (
                      <TableRow key={index} className="border-border hover:bg-secondary/50">
                        {groupByColumns.map((col) => (
                          <TableCell key={col}>
                            {col === 'month' 
                              ? formatMonthValue(item[col as keyof AggregateDataItem])
                              : item[col as keyof AggregateDataItem]
                            }
                          </TableCell>
                        ))}
                        <TableCell>{item.total_minutes.toFixed(2)}</TableCell>
                        <TableCell>{item.play_count.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-8 bg-gradient-card border-border">
            <div className="text-center text-muted-foreground space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-4">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground">No data found</h3>
              <p className="text-lg">
                {groupByColumns.length === 0 
                  ? "Select your parameters above and execute a query to see your Spotify insights"
                  : "No data matches your current filters. Try adjusting your search criteria."
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Spotify;