import { useState } from 'react';
import { useActor } from '../../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginDebugPage() {
  const { actor } = useActor();
  const [email, setEmail] = useState('puadsolihan@gmail.com');
  const [password, setPassword] = useState('66669999');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    token?: string;
    role?: string;
    error?: string;
  } | null>(null);

  const handleTest = async () => {
    if (!actor) {
      setResult({
        success: false,
        error: 'Actor not available. Please wait for the system to initialize.'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const loginResult = await actor.adminLogin(email, password);
      
      if (loginResult) {
        setResult({
          success: true,
          token: loginResult.token,
          role: loginResult.role
        });
      } else {
        setResult({
          success: false,
          error: 'Login failed. Invalid email or password, or user account is not active.'
        });
      }
    } catch (error: any) {
      console.error('Login test error:', error);
      setResult({
        success: false,
        error: error.message || 'An unexpected error occurred during login test'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Login Debug Test</h1>
          <p className="text-gray-600 mt-2">
            Test admin authentication and verify the login flow is working correctly
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Credentials</CardTitle>
            <CardDescription>
              Enter email and password to test the admin login flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>

            <Button onClick={handleTest} disabled={isLoading || !email || !password || !actor} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Run Login Test'
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Login authentication test results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Login Status</p>
                    <p className="text-lg font-semibold mt-1">
                      {result.success ? 'Success' : 'Failed'}
                    </p>
                  </div>
                  {result.success ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>

                {result.success && result.role && (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-600">User Role</p>
                      <Badge variant="outline" className="mt-1">
                        {result.role}
                      </Badge>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                )}

                {result.success && result.token && (
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-600 mb-2">Session Token</p>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                      {result.token}
                    </p>
                  </div>
                )}
              </div>

              {result.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result.success && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Authentication successful. The admin login system is working correctly.
                    You can now use these credentials on the main login page.
                  </AlertDescription>
                </Alert>
              )}

              {!result.success && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Troubleshooting</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Verify the email and password are correct</li>
                      <li>Ensure the Super Admin account has been seeded in the backend</li>
                      <li>Check that the user account status is "Active"</li>
                      <li>Verify the backend canister is running and accessible</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Default Super Admin Credentials</CardTitle>
            <CardDescription>
              These credentials should work if the backend seeding is successful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-600">Email:</span>
                <span className="font-mono">puadsolihan@gmail.com</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-600">Password:</span>
                <span className="font-mono">66669999</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-600">Role:</span>
                <span>Super Admin</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
