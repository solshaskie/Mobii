'use client';

import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Progress, Switch, Input } from '@mobii/ui';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-text-primary">UI Components Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button Test */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button variant="gradient">Gradient Button</Button>
            </CardContent>
          </Card>

          {/* Card Test */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-muted">This is a test card with content.</p>
            </CardContent>
          </Card>

          {/* Badge Test */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </CardContent>
          </Card>

          {/* Progress Test */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </CardContent>
          </Card>

          {/* Switch Test */}
          <Card>
            <CardHeader>
              <CardTitle>Switches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-text-primary">Default Switch</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked />
                <span className="text-text-primary">Checked Switch</span>
              </div>
            </CardContent>
          </Card>

          {/* Input Test */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter text..." />
              <Input type="email" placeholder="Enter email..." />
              <Input type="password" placeholder="Enter password..." />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
